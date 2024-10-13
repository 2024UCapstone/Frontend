import useFetchData from "hooks/useFetchData";
import styles from "./StationDetail.module.css";
import { useEffect, useState } from "react";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import { useMap, useMapActions } from "store/UseMapStore";

/**
 * 즐겨찾기 등록한 정류장을 누르면 해당 정류장으로 마커 -> 정류장위치(도착), 버스위치로 하여 남은 시간 출력
 */
function StationDetail({ station }) {
  const [busInfo, setBusInfo] = useState([]);
  const {setCenter} = useMapActions();

  const { data: busStationData, fetchData: busStationFetch, loading: stationLoading, error: stationError } = useFetchData(
    `http://DevSe.gonetis.com:12599/api/bus/stations/${station.id}`
  );

  const { data: busDestinationData, fetchData: busDestinationFetch, loading: destinationLoading, error: destinationError } = useFetchData(
    `http://DevSe.gonetis.com:12599/api/kakao-api/arrival-time/single?origin=${busStationData?.location?.x},${busStationData?.location?.y}&destination=${station.location.x},${station.location.y}`
  );

  useEffect(() => {
    console.log(station);
    setCenter(station.location.x, station.location.y);
    busStationFetch();
  }, []);

  useEffect(() => {
    if (busStationData && busStationData.location) {
      busDestinationFetch();
    }
  }, [busStationData]);

  useEffect(() => {
    if (busStationData && busDestinationData) {
      const combinedInfo = busStationData.map(bus => ({
        ...bus,
        arrivalTime: busDestinationData
      }));
      setBusInfo(combinedInfo);
    }
  }, [busStationData, busDestinationData]);

  useEffect(()=>{
    // 예제 데이터를 비동기로 가져오는 경우를 가정
      setBusInfo([
          { busNumber: 1234, arrivalTime: "곧 도착", occupiedSeats: 10 },
          { busNumber: 5678, arrivalTime: "10분 후 도착", occupiedSeats: 30 },
      ]);
  }, []);

  if (stationLoading || destinationLoading) return <LoadingPage/>;
  if (stationError || destinationError) return <div>Error occurred while fetching data</div>;
    // setBusInfo([...busStationData, ...busDestinationData]);

return (
  <div>  
    <div className={styles["station-info"]}>
        {/* <div className="station-name">{station.name}</div> */}
        <div className={styles["bus-info"]}>
        {busInfo.map((bus, idx) => (
            <div key={idx} className={styles["bus-item"]}>
            <span className={styles["bus-id"]}>[{bus.busNumber}]</span>
            <span className={styles["bus-status"]}>{bus.arrivalTime}</span>
            <div className={styles["progress-bar-container"]}>
                <div
                className={styles["progress-bar"]}
                style={{ width: `${(bus.occupiedSeats / 45) * 100}%` }}
                ></div>
            </div>
            <span className={styles["bus-seats"]}>{bus.occupiedSeats}석</span>
            {/* <progress className="bus-seats" value="20" min="0" max="50">{bus.seats}석</progress> */}
            </div>
        ))}
        </div>
      </div>
    </div>
  );  
}

export default StationDetail;
