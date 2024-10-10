import styles from "./StationDetail.module.css";
import { useEffect, useState } from "react";
import { useMap, useMapActions } from "store/UseMapStore";

/**
 * 즐겨찾기 등록한 정류장을 누르면 해당 정류장으로 마커 -> 정류장위치(도착), 버스위치로 하여 남은 시간 출력
 */
function StationDetail({ selectedStation }) {
const { center, isLoading, errMsg } = useMap();
const { setCenter, setIsLoading, setErrMsg } = useMapActions();
const [stations, setStations] = useState([]);
const [busInfo, setBusInfo] = useState([]);

  // 예제 데이터를 가져오는 useEffect
  useEffect(() => {
    // 예제 데이터를 비동기로 가져오는 경우를 가정
      setTimeout(() => {
      setStations([{ name: "중부경찰서", favorite: true }]);
      setBusInfo([
          { id: 1234, distance: "180m", status: "곧 도착", seats: 10 },
          { id: 5678, distance: "680m", status: "10분 후 도착", seats: 30 },
      ]);
    });
  }, []);

return (
  <div>  
    {stations.map((station, index) => (
      <div key={index} className={styles["station-info"]}>
          {/* <div className="station-name">{station.name}</div> */}
          <div className={styles["bus-info"]}>
          {busInfo.map((bus, idx) => (
              <div key={idx} className={styles["bus-item"]}>
              <span className={styles["bus-id"]}>[{bus.id}]</span>
              <span className={styles["bus-distance"]}>{bus.distance}</span>
              <span className={styles["bus-status"]}>{bus.status}</span>
              <div className={styles["progress-bar-container"]}>
                  <div
                  className={styles["progress-bar"]}
                  style={{ width: `${(10 / 50) * 100}%` }}
                  ></div>
              </div>
              <span className={styles["bus-seats"]}>{bus.seats}석</span>
              {/* <progress className="bus-seats" value="20" min="0" max="50">{bus.seats}석</progress> */}
              </div>
          ))}
          </div>
      </div>
      ))}
    </div>
  );  
}

export default StationDetail;
