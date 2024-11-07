import { Map, MapMarker } from "react-kakao-maps-sdk";
import styles from "./MapView.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { BusIcon, BusStopIcon } from "assets/images";
import { useMap, useMapActions } from "store/UseMapStore";
import { useHeightActions, useHeightState } from "store/UseHeightStore";
import axios from "axios";
import { debounce } from "lodash";
import { ReactComponent as IconMyLocation } from "../../assets/logos/myLocation.svg";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import useGeolocation from "hooks/useGeoLocation";
import useSelectedStationStore from "store/UseSelectedStationStore";

export default function MapView() {
  const { mapHeight } = useHeightState();
  const { updateMapHeight } = useHeightActions();

  const { center, isLoading } = useMap();
  const { setCenter, setErrMsg, setIsLoading, resetMapState } = useMapActions();
  const location = useGeolocation();
  const websocket = useRef(null);

  const [stationPositions, setStationPositions] = useState([]);
  const [busPositions, setBusPositions] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: null, lng: null });
  const { selectedStation, setSelectedStation, resetSelectedStation } = useSelectedStationStore();

  // 초기화 상태를 관리하는 상태들
  const [isLocationInitialized, setIsLocationInitialized] = useState(false);
  const [isStationInitialized, setIsStationInitialized] = useState(false);
  const [isBusInitialized, setIsBusInitialized] = useState(false);
  const [isWebSocketInitialized, setIsWebSocketInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);


  // 모든 초기화가 완료되었는지 확인
  const isFullyInitialized = useMemo(() => {
    return (
      isLocationInitialized &&
      isStationInitialized &&
      isBusInitialized &&
      isWebSocketInitialized &&
      center.lat &&
      center.lng
    );
  }, [
    isLocationInitialized,
    isStationInitialized,
    isBusInitialized,
    isWebSocketInitialized,
    center.lat,
    center.lng,
  ]);

    // 초기화 상태 리셋 함수
    const resetInitializationState = () => {
      setIsLocationInitialized(false);
      setIsStationInitialized(false);
      setIsBusInitialized(false);
    };

      // selectedStation이 변경될 때 초기화 상태를 리셋하고 재초기화 시작
  useEffect(() => {
    resetInitializationState();
    setIsLoading(true);
    
    // 위치 정보 재초기화
    if (location.loaded && location.coordinates) {
      setMyLocation({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      });
      setIsLocationInitialized(true);
    }

    // 정류장 정보 재로드
    fetchStationLocations();

    // 버스 위치 재로드
    fetchBusLocations();

  }, [selectedStation]);

  // 초기화 상태에 따른 로딩 상태 관리
  useEffect(() => {
    if (!isFullyInitialized) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isFullyInitialized, setIsLoading]);

  // Map 사이즈 변동 관련 Effect
  useEffect(() => {
    updateMapHeight();
    const handleResize = () => updateMapHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateMapHeight]);

  // 현재 위치 설정
  useEffect(() => {
    if (location.loaded && location.coordinates) {
      setMyLocation({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      });
      setIsLocationInitialized(true); // 에러가 나도 초기화는 완료된 것으로 처리
    } else if (location.error) {
      setErrMsg(location.error.message || "위치 정보를 가져올 수 없습니다.");
      setIsLocationInitialized(true); // 에러가 나도 초기화는 완료된 것으로 처리
    }
  }, [location]);

  // center 좌표 초기화
  useEffect(() => {
    const initializeCenter = async () => {
      try {
        if (selectedStation?.location?.x && selectedStation?.location?.y) {
          if(isDragging) alert("잠시 뒤에 정류장을 선택해주세요");
          else setCenter(selectedStation.location.x, selectedStation.location.y);
        } else {
          setCenter(myLocation.lat, myLocation.lng);
        }
      } catch (error) {
        console.error("Center initialization error:", error);
        setErrMsg("중심 좌표 초기화 중 오류가 발생했습니다.");
      }
    };

    if (isLocationInitialized) {
      initializeCenter();
    }
  }, [myLocation, selectedStation, isLocationInitialized, isDragging]);

  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map) => {
        // 드래그 중일 때만 중심 좌표 업데이트
        if (isDragging) {
          const newLat = map.getCenter().getLat();
          const newLng = map.getCenter().getLng();
          if (
            Math.abs(center.lat - newLat) > 0.0000001 ||
            Math.abs(center.lng - newLng) > 0.0000001
          ) {
            setCenter(newLat, newLng);
          }
        }
      }, 500),
    [center.lat, center.lng, setCenter, isDragging]
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
      const stationData = response.data.data;
      setStationPositions(stationData);
      setIsStationInitialized(true);
    } catch (error) {
      console.error("정류장 위치를 불러오는 중 오류 발생:", error);
      setIsStationInitialized(true); // 에러가 나도 초기화는 완료된 것으로 처리
    }
  };

  // 정류장 위치 초기화
  useEffect(() => {
    fetchStationLocations();
  }, []);

  // 버스 위치 초기화
  const fetchBusLocations = async () => {
    try {
      const response = await axios.get(`https://devse.gonetis.com/api/bus`);
      setBusPositions(response.data.data);
      setIsBusInitialized(true);
    } catch (error) {
      console.error("버스 위치를 불러오는 중 오류 발생:", error);
      setIsBusInitialized(true);
    }
  };


  // 초기 버스 위치 로드
  useEffect(() => {
    fetchBusLocations();
  }, []);

  // WebSocket 연결 및 데이터 처리
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    let retryTimeoutId;

    const connectWebSocket = () => {
      if (retryCount >= MAX_RETRIES) {
        console.log(`최대 재연결 시도 횟수(${MAX_RETRIES}회)를 초과했습니다.`);
        setIsWebSocketInitialized(true); // 최대 재시도 도달해도 초기화는 완료된 것으로 처리
        return;
      }

      websocket.current = new WebSocket("wss://devse.gonetis.com/bus-location");

      websocket.current.onopen = () => {
        console.log("WebSocket Connected to Spring Server");
        setIsWebSocketInitialized(true);
        retryCount = 0;

        const subscribeMsg = {
          type: "SUBSCRIBE",
          destination: "/topic/bus-locations",
        };
        websocket.current.send(JSON.stringify(subscribeMsg));
      };

      websocket.current.onmessage = (event) => {
        try {
          const rows = event.data.split("\n");
          const newBusPositions = rows
            .filter((row) => row.trim())
            .map((row) => {
              const [busNumber, lat, lng, seats] = row.split(",");
              return {
                busNumber: busNumber.trim(),
                location: {
                  coordinates: [parseFloat(lng), parseFloat(lat)],
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
        if (retryCount < MAX_RETRIES) {
          retryTimeoutId = setTimeout(connectWebSocket, 3000);
        }
      };

      websocket.current.onclose = () => {
        console.log("WebSocket Disconnected");
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          retryTimeoutId = setTimeout(connectWebSocket, 3000);
        } else {
          setIsWebSocketInitialized(true);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
      if (websocket.current) websocket.current.close();
    };
  }, []);

  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "9999px",
    width: "45px",
    height: "45px",
    backgroundColor: "white",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.25)",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "absolute",
    zIndex: 1,
    top: 50,
    right: 0,
    padding: "10px",
  };

  // center 객체를 메모이제이션
  const memoizedCenter = useMemo(
    () => ({
      lat: parseFloat(center?.lat),
      lng: parseFloat(center?.lng),
    }),
    [center?.lat, center?.lng]
  );

  return !isFullyInitialized || isLoading ? (
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
    <div className={styles.mapViewContainer} style={{ height: `${mapHeight}px` }}>
      <Map
        onCenterChanged={updateCenterWhenMapMoved}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className={styles.mapView}
        center={memoizedCenter}
        level={3}
      >
        {/* 현재 위치 마커 */}
        {myLocation.lat && myLocation.lng && <MapMarker position={myLocation} />}

        {/* 버스 정류장 마커 */}
        {stationPositions.length > 0 && stationPositions.map((station) => (
          <MapMarker
            key={station.id}
            position={{lat:station.location.x, lng:station.location.y}}
            image={{
              src: BusStopIcon,
              size: { width: 30, height: 30 },
            }}
            title={station.name}
            onClick={()=> setSelectedStation(station)}
          />
        ))}

        {/* 버스 위치 마커 */}
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
              <div style={{ padding: "5px", color: "#000" }}>
                {`버스 번호: ${bus.busNumber}`}
              </div>
            </MapMarker>
          ))}
      </Map>

      <div style={containerStyle}>
        <button style={buttonStyle} onClick={setCenterToMyPosition}>
          <IconMyLocation width={25} height={25} />
        </button>
      </div>
    </div>
  );
}