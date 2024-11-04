import { Map, MapMarker } from "react-kakao-maps-sdk";
import styles from "./MapView.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { BusIcon, BusStopIcon } from "assets/images";
import { useMap, useMapActions } from "store/UseMapStore";
import { useHeightActions, useHeightState } from "store/UseHeightStore";
import axios from "axios";
import { debounce } from "lodash";
import { ReactComponent as IconMyLocation } from "../../assets/logos/myLocation.svg"
import LoadingPage from "pages/LoadingPage/LoadingPage";
import useGeolocation from "hooks/useGeoLocation";
import useSelectedStationStore from "store/UseSelectedStationStore";

export default function MapView() {
  const { mapHeight } = useHeightState();
  const { updateMapHeight } = useHeightActions();

  const { center, isLoading } = useMap();
  const { setCenter, setErrMsg, setIsLoading } = useMapActions();
  const location = useGeolocation();
  const websocket = useRef(null);
  const centerInitialized = useRef(false);

  const [stationPositions, setStationPositions] = useState([]);
  const [busPositions, setBusPositions] = useState([]);
  const [myLocation, setMyLocation] = useState({lat: null, lng: null});
  const {selectedStation} = useSelectedStationStore();

  // Map 사이즈 변동 관련 Effect
  useEffect(() => {
    updateMapHeight();
    const handleResize = () => updateMapHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateMapHeight]);

    // 현재 위치 설정 - 무조건 실행
    useEffect(() => {
      if (location.loaded && location.coordinates) {
        setMyLocation({
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        });
        setIsLoading(false);
      } else if (location.error) {
        setErrMsg(location.error.message || "위치 정보를 가져올 수 없습니다.");
        setIsLoading(false);
      }
    }, [location, setErrMsg, setIsLoading]);

  // 중심 좌표(center) 설정
  useEffect(() => {
    const initializeCenter = () => {
      if (centerInitialized.current) return;
      
      setIsLoading(true);
      try {
        // selectedStation이 있는 경우 해당 위치로 center 설정
        if (selectedStation?.location?.x && selectedStation?.location?.y) {
          setCenter(selectedStation.location.x, selectedStation.location.y);
          centerInitialized.current = true;
        }
        // selectedStation이 없고 현재 위치가 있는 경우 현재 위치로 center 설정
        else if (myLocation.lat && myLocation.lng && !center.lat && !center.lng) {
          setCenter(myLocation.lat, myLocation.lng);
          centerInitialized.current = true;
        }
      } catch (error) {
        console.error("Center initialization error:", error);
        setErrMsg("중심 좌표 초기화 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeCenter();
  }, [myLocation, selectedStation, center, setCenter, setIsLoading, setErrMsg]);

  // selectedStation이 변경될 때 center 업데이트
  useEffect(() => {
    if (selectedStation?.location?.x && selectedStation?.location?.y) {
      setCenter(selectedStation.location.x, selectedStation.location.y);
      centerInitialized.current = true;
    }
  }, [selectedStation, setCenter]);

  // 지도 중심좌표 이동 감지 시 이동된 중심좌표로 설정
  const updateCenterWhenMapMoved = useMemo(
    () =>
    debounce((map) => {
      if (!centerInitialized.current) return;

      const newLat = map.getCenter().getLat();
      const newLng = map.getCenter().getLng();
      
      if (
        Math.abs(center.lat - newLat) > 0.0000001 || 
        Math.abs(center.lng - newLng) > 0.0000001
      ) {
        setCenter(newLat, newLng);
      }
    }, 500),
    [center.lat, center.lng, setCenter]
  );

  // 현재 위치로 이동하는 버튼 핸들러
  const setCenterToMyPosition = () => {
    if (myLocation.lat && myLocation.lng) {
      setCenter(myLocation.lat, myLocation.lng);
    }
  };

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
      websocket.current = new WebSocket("wss://devse.gonetis.com/bus-location");
      // websocket.current = new WebSocket("http://localhost:3000/bus-location");

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
              const [busNumber, lat, lng, seats] = row.split(",");
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

  const fetchBusLocations = async () => {
    try {
      const response = await axios.get(`https://devse.gonetis.com/api/bus`);
      setBusPositions(response.data.data); // 여러 버스의 위치를 상태로 저장
    } catch (error) {
      console.error("버스 위치를 불러오는 중 오류 발생:", error);
    }
  };

  // 처음 1회 버스의 현재 위치 표기 설정
  useEffect(() => {
    fetchBusLocations()
  }, [])

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '9999px', // rounded-full에 해당
    width: '45px',
    height: '45px',
    backgroundColor: 'white',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)'
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    position: 'absolute',
    zIndex: 1,
    top: 50,
    right: 0,
    padding: '10px'
  };
  return (
    isLoading ?
      // 로딩 페이지 스타일
      <div style={{ height: `${mapHeight}px`, width: "100vw", display: "flex", padding: "3em", alignItems: "center", backgroundColor: "lightgrey" }}>
        <LoadingPage />
      </div>
      :
      (center.lng && center.lat) && (
        <div
          className={styles.mapViewContainer}
          style={{ height: `${mapHeight}px` }}
        >
          <Map 
          onCenterChanged={updateCenterWhenMapMoved}
          className={styles.mapView} center={center} level={3}>
            {/* 현재 위치 마커 띄우기 */}
            {!isLoading && myLocation.lat && myLocation.lng && (
              <MapMarker position={myLocation}/>
            )}
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
            {busPositions.length > 0 && busPositions.map((bus) => (
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
        <div style={containerStyle}>
          {/* 중심좌표 재설정 버튼 */}
          <button
            style={buttonStyle}
            onClick={setCenterToMyPosition}
          >
            <IconMyLocation width={25} height={25} />
          </button>
        </div>
      </div>
    )
  );
}
