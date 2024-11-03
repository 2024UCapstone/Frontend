import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import styles from "./MapView.module.css";
import { useEffect, useRef, useState } from "react";
import { BusIcon, BusStopIcon } from "assets/images";
import { useMap, useMapActions } from "store/UseMapStore";
import { useHeightActions, useHeightState } from "store/UseHeightStore";
import useGeolocation from "hooks/useGeoLocation";
import axios from "axios";
import LoadingPage from "pages/LoadingPage/LoadingPage";

export default function MapView() {
  const { mapHeight } = useHeightState();
  const { updateMapHeight } = useHeightActions();

  const { center, errMsg, isLoading } = useMap();
  const { setCenter, setErrMsg, setIsLoading, resetMapState } = useMapActions();

  const location = useGeolocation();
  const websocket = useRef(null);

  const [stationPositions, setStationPositions] = useState([]); // 정류장 위치 상태
  const [busPositions, setBusPositions] = useState([]); // 여러 버스 위치 상태

  /**
   * Map 사이즈 변동 관련 Effect
   */
  useEffect(() => {
    updateMapHeight();
    const handleResize = () => updateMapHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateMapHeight]);

  /**
   * 현재 위치 불러와 데이터 받기
   */
  useEffect(() => {
    if (location.loaded) {
      if (location.coordinates) {
        setCenter(location.coordinates.lat, location.coordinates.lng);
        setIsLoading(false);
      } else if (location.error) {
        setErrMsg(location.error.message || "위치 정보를 가져올 수 없습니다.");
        setIsLoading(false);
      }
    }
  }, [location]);

  // 서버에서 모든 정류장 위치 불러오기
  const fetchStationLocations = async () => {
    try {
      const response = await axios.get(`https://devse.gonetis.com/api/station`);
      const stationData = response.data.data.map((station) => ({
        id: station.id,
        name: station.name,
        location: {
          lat: station.location.x,
          lng: station.location.y,
        },
      }));
      setStationPositions(stationData); // 정류장 위치 상태 업데이트
    } catch (error) {
      console.error("정류장 위치를 불러오는 중 오류 발생:", error);
    }
  };
  // 정류장 위치는 초기 렌더링 시 한 번만 불러옴
  useEffect(() => {
    fetchStationLocations();
  }, []);

  /**
   * WebSocket 연결 및 데이터 처리 - 버스 위치 파싱
   */
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    let retryTimeoutId;

    const connectWebSocket = () => {
      // 최대 재시도 횟수 체크
      if (retryCount >= MAX_RETRIES) {
        console.log(`최대 재연결 시도 횟수(${MAX_RETRIES}회)를 초과했습니다.`);
        return;
      }

      // Spring 웹소켓 서버 연결
      // websocket.current = new WebSocket("wss://devse.gonetis.com/bus-location");
      websocket.current = new WebSocket("http://localhost:3000/bus-location");

      websocket.current.onopen = () => {
        console.log("WebSocket Connected to Spring Server");
        // 연결 성공시 재시도 카운트 초기화
        retryCount = 0;

        const subscribeMsg = {
          type: "SUBSCRIBE",
          destination: "/topic/bus-locations",
        };
        websocket.current.send(JSON.stringify(subscribeMsg));
      };

      websocket.current.onmessage = (event) => {
        try {
          // CSV 데이터 파싱
          const rows = event.data.split("\n");
          const newBusPositions = rows
            .filter((row) => row.trim())
            .map((row) => {
              const [busNumber, lat, lng] = row.split(",");
              return {
                busNumber: busNumber.trim(),
                location: {
                  coordinates: [parseFloat(lat), parseFloat(lng)],
                },
              };
            })
            .filter(
              (pos) =>
                !isNaN(pos.location.coordinates[0]) &&
                !isNaN(pos.location.coordinates[1])
            );

          if (newBusPositions.length > 0) {
            setBusPositions(newBusPositions);
          }
        } catch (error) {
          console.error("Data parsing error:", error);
        }
      };

      websocket.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
        retryCount++;
        console.log(`연결 재시도 중... (${retryCount}/${MAX_RETRIES})`);

        if (retryCount < MAX_RETRIES) {
          retryTimeoutId = setTimeout(connectWebSocket, 3000);
        } else {
          console.log("최대 재시도 횟수에 도달했습니다. 연결을 중단합니다.");
        }
      };

      websocket.current.onclose = () => {
        console.log("WebSocket Disconnected from Spring Server");
        retryCount++;
        console.log(`연결 재시도 중... (${retryCount}/${MAX_RETRIES})`);

        if (retryCount < MAX_RETRIES) {
          retryTimeoutId = setTimeout(connectWebSocket, 3000);
        } else {
          console.log("최대 재시도 횟수에 도달했습니다. 연결을 중단합니다.");
        }
      };
    };

    connectWebSocket();

    // 클린업 함수
    return () => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);
  // const fetchBusLocations = async () => {
  //   try {
  //     const response = await axios.get(`http://devse.gonetis.com:12599/api/bus`);
  //     console.log("busData", response.data.data)
  //     // console.log("location", busData.location)
  //     setBusPositions(response.data.data); // 여러 버스의 위치를 상태로 저장
  //     response.data.data.map((bus) => {
  //       console.log(bus.location.coordinates)
  //     })
  //   } catch (error) {
  //     console.error("버스 위치를 불러오는 중 오류 발생:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchBusLocations()
  // }, [])

  useEffect(() => {
    console.log("Bus List:", busPositions); // 버스 리스트 확인용 로그 추가
  }, [busPositions]);

  // // 0.3초마다 버스 위치 업데이트
  // useEffect(() => {
  //   const intervalId = setInterval(fetchBusLocations, 300);
  //   return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
  // }, []);

  return isLoading ? (
    // 로딩 페이지 스타일
    <div
      style={{
        height: `${mapHeight}px`,
        width: "100vw",
        display: "flex",
        padding: "3em",
        alignItems: "center",
        backgroundColor: "lightgrey",
      }}
    >
      <LoadingPage />
    </div>
  ) : (
    center && (
      <div
        className={styles.mapViewContainer}
        style={{ height: `${mapHeight}px` }}
      >
        <Map className={styles.mapView} center={center} level={3}>
          {/* 현재 위치 마커 띄우기 */}
          {!isLoading && <MapMarker position={center}></MapMarker>}
          {/* 버스 정류장 마커 띄우기 */}
          {stationPositions.map((station, index) => (
            <MapMarker
              key={station.id}
              position={station.location}
              image={{
                src: BusStopIcon,
                size: { width: 30, height: 30 },
              }}
              title={station.title}
            />
          ))}
          {/* 여러 버스 위치 마커 */}
          {busPositions.length > 0 &&
            busPositions.map((bus) => (
              <MapMarker
                key={bus.busNumber}
                position={{
                  lat: bus.location.coordinates[0],
                  lng: bus.location.coordinates[1],
                }}
                title={`버스 번호: ${bus.busNumber}`}
                image={{
                  src: BusIcon,
                  size: { width: 30, height: 30 },
                }}
              >
                <div
                  style={{ padding: "5px", color: "#000" }}
                >{`버스 번호: ${bus.busNumber}`}</div>
              </MapMarker>
            ))}
        </Map>
      </div>
    )
  );
}
