import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import styles from "./MapView.module.css";
import { useEffect, useState } from "react";
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

  const [stationPositions, setStationPositions] = useState([]); // 정류장 위치 상태
  const [busPositions, setBusPositions] = useState([]); // 여러 버스 위치 상태
  const [isBusLoading, setIsBusLoading] = useState(true);

  /**
   * Map 사이즈 변동 관련 Effect
   */
  useEffect(() => {
    updateMapHeight();
    const handleResize = () => updateMapHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  }, [location, setCenter, setErrMsg, setIsLoading]);

  // 서버에서 모든 정류장 위치 불러오기
  const fetchStationLocations = async () => {
    try {
      const response = await axios.get(`http://devse.gonetis.com:12599/api/station`);
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

  // 서버에서 모든 버스 위치 불러오기
  const fetchBusLocations = async () => {
    try {
      const response = await axios.get(`http://devse.gonetis.com:12599/api/bus`);
      const busData = response.data.data.map((bus) => ({
        busNumber: bus.busNumber,
        location: bus.location,
      }));
      console.log(busData)
      setBusPositions(busData); // 여러 버스의 위치를 상태로 저장
    } catch (error) {
      console.error("버스 위치를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchBusLocations()
  }, [])

  // // 0.3초마다 버스 위치 업데이트
  // useEffect(() => {
  //   const intervalId = setInterval(fetchBusLocations, 300);
  //   return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
  // }, []);



  const busStopList = [
    { title: "2대학관", latlng: { lat: 35.495299450684456, lng: 129.4172414821444 } },
    { title: "1대학관", latlng: { lat: 35.49491121578819, lng: 129.4163814699469 } },
    { title: "3대학관", latlng: { lat: 35.49574107312693, lng: 129.41678645417534 } },
    { title: "행정본관", latlng: { lat: 35.49547208702291, lng: 129.416045699906 } },
  ];

  return (
    <div className={styles.mapViewContainer} style={{ height: `${mapHeight}px` }}>
      <Map
        className={styles.mapView}
        center={center}
        level={4}
      >
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
        {!isBusLoading &&
          busPositions.map((bus, index) => (
          <MapMarker
            key={bus.busNumber}
            position={bus.location}
            title={bus.busNumber} // 버스 번호를 마커에 표시
            image={{
              src: BusIcon,
              size: { width: 35, height: 35 },
            }}
          >
          <div style={{ padding: "5px", color: "#000" }}>{`버스 번호: ${bus.busNumber}`}</div>
          </MapMarker>
        ))}
        <MapTypeId type={"TRAFFIC"} />
      </Map>
    </div>
  );
}