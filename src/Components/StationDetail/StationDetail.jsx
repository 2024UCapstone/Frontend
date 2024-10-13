import useFetchData from "hooks/useFetchData";
import styles from "./StationDetail.module.css";
import { useEffect, useState } from "react";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import { useMap, useMapActions } from "store/UseMapStore";
import axios from "axios";

/**
 * 즐겨찾기 등록한 정류장을 누르면 해당 정류장으로 마커 -> 정류장위치(도착), 버스위치로 하여 남은 시간 출력
 */
function StationDetail({ station }) {
  const [busInfo, setBusInfo] = useState([]);
  const {setCenter} = useMapActions();

  const { data: busStationData, fetchData: busStationFetch, loading: stationLoading, error: stationError } = useFetchData(
    // `http://DevSe.gonetis.com:12599/api/bus/stations/${station.id}`
    `http://DevSe.gonetis.com:12599/api/bus/stations/${station.id}`
  );

  const [destinationLoading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [busDestinationData, setBusDestinationData] = useState([]);
  
  const busDestinationFetch = async (name, x, y) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://DevSe.gonetis.com:12599/api/kakao-api/arrival-time/single?origin=${name},${y},${x}&destination=${station.name},${station.location.y},${station.location.x}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
  
      console.log('API Response:', response.data); // 응답 데이터 로깅
  
      setBusDestinationData(prevData => {
        const newData = response.data.data;
  
        // newData가 배열이 아니면 배열로 변환
        const newDataArray = Array.isArray(newData) ? newData : [newData];
  
        if (!Array.isArray(prevData)) {
          return newDataArray;
        }
  
        const updatedData = [...prevData];
  
        newDataArray.forEach(newItem => {
          if (newItem && newItem.name) {
            const existingItemIndex = updatedData.findIndex(item => item.name === newItem.name);
            if (existingItemIndex !== -1) {
              updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                durationMessage: newItem.durationMessage
              };
            } else {
              updatedData.push(newItem);
            }
          } else {
            console.error('Invalid item in newData:', newItem);
          }
        });
  
        return updatedData;
      });
  
    } catch (error) {
      console.error('Error fetching bus destination data:', error);
      // 에러 처리 로직을 여기에 추가하세요
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setCenter(station.location.x, station.location.y);
    busStationFetch();
  }, []);
  
  useEffect(() => {
    if (busStationData.data && busStationData.data.length > 0) {
      const fetchAllDestinations = async () => {
        setLoading(true);
        for (const item of busStationData.data) {
          if (item.location && item.location.x && item.location.y) {
            await busDestinationFetch(item.busNumber, item.location.x, item.location.y);
          } else {
            console.error('Invalid location data for item:', item);
          }
        }
        setLoading(false);
      };
      fetchAllDestinations();
    }
  }, [busStationData]);
  
  useEffect(() => {
    if (busStationData.data && busDestinationData.length > 0) {
      const combinedInfo = busStationData.data.map(bus => {
        const destinationInfo = busDestinationData.find(item => item.name === bus.busNumber);
        return {
          ...bus,
          durationMessage: destinationInfo ? destinationInfo.durationMessage : '정보 없음'
        };
      });
      setBusInfo(combinedInfo);
    }
  }, [busStationData, busDestinationData]);

  if (stationLoading || destinationLoading) return <LoadingPage/>;
  if (stationError) return <div>Error occurred while fetching data</div>;

return (
  <div>  
    <div className={styles["station-info"]}>
        {/* <div className="station-name">{station.name}</div> */}
        <div className={styles["bus-info"]}>
        {busInfo && busInfo.length > 0 ? (
        busInfo.map((bus, idx) => (
            <div key={idx} className={styles["bus-item"]}>
            <span className={styles["bus-id"]}>[{bus.busNumber}]</span>
            <span className={styles["bus-status"]}>{bus.durationMessage}</span>
            <div className={styles["progress-bar-container"]}>
                <div
                className={styles["progress-bar"]}
                style={{ width: `${(bus.occupiedSeats / 45) * 100}%` }}
                ></div>
            </div>
            <span className={styles["bus-seats"]}>{bus.occupiedSeats}석</span>
            {/* <progress className="bus-seats" value="20" min="0" max="50">{bus.seats}석</progress> */}
            </div>
        ))
      )
        : (
          <div>검색 결과가 없습니다.</div>
        )}
        </div>
      </div>
    </div>
  );  
}

export default StationDetail;
