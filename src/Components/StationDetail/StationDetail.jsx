import useFetchData from "hooks/useFetchData";
import styles from "./StationDetail.module.css";
import { useEffect, useState, useCallback } from "react";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import { useMapActions } from "store/UseMapStore";
import axios from "axios";

function StationDetail({ station }) {
  const [busInfo, setBusInfo] = useState([]);
  const { setCenter } = useMapActions();

  const { data: busStationData, fetchData: busStationFetch, loading: stationLoading, error: stationError } = useFetchData(
    `https://DevSe.gonetis.com/api/bus/stations/${station.id}`
  );

  const [destinationLoading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [busDestinationData, setBusDestinationData] = useState([]);

  const parseDurationMessage = (message) => {
    const matches = message.match(/(\d+)분\s*(\d+)?초?/);
    if (matches) {
      const minutes = parseInt(matches[1], 10);
      const seconds = matches[2] ? parseInt(matches[2], 10) : 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  const busDestinationFetch = useCallback(async (name, x, y) => {
    try {
      const response = await axios.get(`https://DevSe.gonetis.com/api/kakao-api/arrival-time/single?origin=${name},${y},${x}&destination=${station.name},${station.location.y},${station.location.x}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      console.log('API Response:', response.data);
      setBusDestinationData(prevData => {
        const newData = response.data.data;
        const newDataArray = Array.isArray(newData) ? newData : [newData];
        if (!Array.isArray(prevData)) {
          return newDataArray.map(item => ({
            ...item,
            remainingTime: parseDurationMessage(item.durationMessage)
          }));
        }
        const updatedData = [...prevData];
        newDataArray.forEach(newItem => {
          if (newItem && newItem.name) {
            const existingItemIndex = updatedData.findIndex(item => item.name === newItem.name);
            if (existingItemIndex !== -1) {
              updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                ...newItem,
                remainingTime: parseDurationMessage(newItem.durationMessage)
              };
            } else {
              updatedData.push({
                ...newItem,
                remainingTime: parseDurationMessage(newItem.durationMessage)
              });
            }
          } else {
            console.error('Invalid item in newData:', newItem);
          }
        });
        return updatedData;
      });
    } catch (error) {
      console.error('Error fetching bus destination data:', error);
    }
  }, [station, token]);

  useEffect(() => {
    const fetchAndSetCenter = () => {
      setCenter(station.location.x, station.location.y);
      busStationFetch();
    };
  
    // 초기 fetch 및 센터 설정
    fetchAndSetCenter();
  
    // 1분마다 재실행하는 interval 설정
    const intervalId = setInterval(fetchAndSetCenter, 60000); // 60000ms = 1분
  
    // cleanup 함수: 컴포넌트가 언마운트되거나 station이 변경될 때 interval 정리
    return () => clearInterval(intervalId);
  }, [station]);

  useEffect(() => {
    if (busStationData.data && busStationData.data.length > 0) {
      const fetchAllDestinations = async () => {
        setLoading(true);
        try {
          const fetchPromises = busStationData.data.map(item => {
            if (item.location && item.location.x && item.location.y) {
              return busDestinationFetch(item.busNumber, item.location.x, item.location.y);
            } else {
              console.error('Invalid location data for item:', item);
              return Promise.resolve();
            }
          });

          await Promise.all(fetchPromises);
        } catch (error) {
          console.error('Error fetching all destinations:', error);
        } finally {
          setLoading(false);
        }
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
          durationMessage: destinationInfo ? formatTime(destinationInfo.remainingTime) : '정보 없음',
          remainingTime: destinationInfo ? destinationInfo.remainingTime : 0
        };
      });
      setBusInfo(combinedInfo);
    }
  }, [busStationData, busDestinationData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBusInfo(prevInfo =>
        prevInfo.map(bus => ({
          ...bus,
          remainingTime: Math.max(0, bus.remainingTime - 1),
          durationMessage: formatTime(Math.max(0, bus.remainingTime - 1))
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (stationLoading || destinationLoading) return <LoadingPage />;
  if (stationError) return <div>Error occurred while fetching data</div>;

  return (
    <div>
      <div className={styles["station-info"]}>
        <div className={styles["bus-info-container"]}>
          <div className={styles["bus-info-header"]}>
            <span className={styles["header-bus-id"]}>버스 번호</span>
            <span className={styles["header-bus-status"]}>도착 예정</span>
            <span className={styles["header-bus-seats"]}>남은 좌석</span>
          </div>
          <div className={styles["bus-info-list"]}>
            {busInfo && busInfo.length > 0 ? (
              busInfo.map((bus, idx) => (
                <div key={idx} className={styles["bus-item"]}>
                  <span className={styles["bus-id"]}>{bus.busNumber}</span>
                  <span className={styles["bus-status"]}>{bus.durationMessage}</span>
                  <div className={styles["seats-info"]}>
                    <div className={styles["progress-bar-container"]}>
                      <div
                        className={styles["progress-bar"]}
                        style={{ width: `${(bus.occupiedSeats / 45) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles["bus-seats"]}>{bus.occupiedSeats}석</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles["no-result"]}>검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default StationDetail;