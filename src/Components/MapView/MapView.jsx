import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import styles from "./MapView.module.css";
import { useEffect, useState } from "react";
import { BusStopIcon } from "assets/images";
import { useMap, useMapActions } from "store/UseMapStore";
import { useHeightActions, useHeightState } from "store/UseHeightStore";
import useGeolocation from "hooks/useGeoLocation";

export default function MapView() {
  const { mapHeight } = useHeightState();
  const { updateMapHeight } = useHeightActions();

  const { center, errMsg, isLoading } = useMap();
  const { setCenter, setErrMsg, setIsLoading, resetMapState } = useMapActions();

  const location = useGeolocation();

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
        {busStopList.map((busStop, index) => (
          <MapMarker
            key={`${busStop.title}-${busStop.latlng.lat}-${busStop.latlng.lng}`}
            position={busStop.latlng}
            image={{
              src: BusStopIcon,
              size: { width: 35, height: 35 },
            }}
            title={busStop.title}
          />
        ))}
        <MapTypeId type={"TRAFFIC"} />
      </Map>
    </div>
  );
}