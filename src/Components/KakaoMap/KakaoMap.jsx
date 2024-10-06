import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import styles from "./KakaoMap.module.css";
import { useEffect, useState } from "react";
import useStore from "store/UseStore"; // Zustand로 상태 관리
import { BusStopIcon } from "assets/images";

export default function KakaoMap() {
  const { mapHeight } = useStore(); // Zustand로 상태 관리

  const [state, setState] = useState({
    center: {
      lat: 35.495789,
      lng: 129.415649,
    },
    errMsg: null,
    isLoading: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
  }, []);

  const busStopList = [
    { title: "2대학관", latlng: { lat: 35.495299450684456, lng: 129.4172414821444 } },
    { title: "1대학관", latlng: { lat: 35.49491121578819, lng: 129.4163814699469 } },
    { title: "3대학관", latlng: { lat: 35.49574107312693, lng: 129.41678645417534 } },
    { title: "행정본관", latlng: { lat: 35.49547208702291, lng: 129.416045699906 } },
  ];

  return (
    <div className={styles.body}>
      <Map
        className={styles.map}
        style={{ height: `${mapHeight}px` }}
        center={state.center}
        level={4}
      >
        {!state.isLoading && (
          <MapMarker position={state.center}>
            <div style={{ padding: "5px", color: "#000" }}>
              {state.errMsg ? state.errMsg : "여기에 계신가요?!"}
            </div>
          </MapMarker>
        )}
        {busStopList.map((busStopList, index) => (
          <MapMarker
            key={`${busStopList.title}-${busStopList.latlng}`}
            position={busStopList.latlng}
            image={{
              src: BusStopIcon,
              size: { width: 35, height: 35 },
            }}
            title={busStopList.title}
          />
        ))}
        <MapTypeId type={"TRAFFIC"} />
      </Map>
    </div>
  );
}
