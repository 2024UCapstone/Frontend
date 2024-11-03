import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import styles from "./MapView.module.css";
import { useEffect, useRef, useState } from "react";
import { BusIcon, BusStopIcon } from "assets/images";
import { useMap, useMapActions } from "store/UseMapStore";
import { useHeightActions, useHeightState } from "store/UseHeightStore";
import useGeolocation from "hooks/useGeoLocation";
import axios from "axios";

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
      const response = await axios.get(
        `http://devse.gonetis.com:12599/api/station`
      );
      const stationData = response.data.data.map((station) => ({
        id: station.id,
        name: station.name,
        location: {
          lat: station.location.x,
          lng: station.location.y,
        },
      }));
      setStationPositions(stationData); // 정류장 위치 상태 업데이트
      stationData.map((busstation) => {
        console.log(busstation.location);
      });
    } catch (error) {
      console.error("정류장 위치를 불러오는 중 오류 발생:", error);
    }
  }
  // 정류장 위치는 초기 렌더링 시 한 번만 불러옴
  useEffect(() => {
    fetchStationLocations();
  }, []);

  /**
   * WebSocket 연결 및 데이터 처리 - 버스 위치 파싱
   */
  useEffect(() => {
    // WebSocket 연결
    websocket.current = new WebSocket("ws://devse.gonetis.com:12555/ws");

    // WebSocket 이벤트 핸들러
    websocket.current.onopen = () => {
      console.log("WebSocket Connected");
    };

    websocket.current.onmessage = (event) => {
      // CSV 데이터 파싱 (format: busNumber,latitude,longitude)
      const rows = event.data.split("\n");
      const newBusPositions = rows.map((row) => {
        const [busNumber, lat, lng] = row.split(",");
        return {
          busNumber: busNumber.trim(),
          location: {
            coordinates: [parseFloat(lat), parseFloat(lng)],
          },
        };
      });

      setBusPositions(newBusPositions);
    };

    websocket.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    websocket.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };
    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
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

  return (
    <div
      className={styles.mapViewContainer}
      style={{ height: `${mapHeight}px` }}
    >
      <Map className={styles.mapView} center={center} level={4}>
        {/* 현재 위치 마커 띄우기 */}
        {!isLoading && (
          <MapMarker position={center}>
            <div style={{ padding: "5px", color: "#000" }}>
              {errMsg ? errMsg : "여기에 계신가요?!"}
            </div>
          </MapMarker>
        )}
        {/* 버스 정류장 마커 띄우기 */}
        {stationPositions.map((station, index) => (
          <MapMarker
            key={station.id}
            position={station.location}
            image={{
              src: BusStopIcon,
              size: { width: 35, height: 35 },
            }}
            title={station.title}
          />
        ))}
        {/* 여러 버스 위치 마커 */}
        {busPositions.map((bus) => (
          <MapMarker
            key={bus.busNumber}
            position={{
              lat: bus.location.coordinates[0],
              lng: bus.location.coordinates[1],
            }}
            title={`버스 번호: ${bus.busNumber}`}
            image={{
              src: BusIcon,
              size: { width: 35, height: 35 },
            }}
          >
            <div
              style={{ padding: "5px", color: "#000" }}
            >{`버스 번호: ${bus.busNumber}`}</div>
          </MapMarker>
        ))}
        {/* <MapTypeId type={"TRAFFIC"} /> */}
      </Map>
    </div>
  );
}
