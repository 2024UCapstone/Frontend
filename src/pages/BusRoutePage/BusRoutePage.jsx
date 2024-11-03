import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./BusRoutePage.module.css";

function BusRoutePage() {
  const { busNumber } = useParams(); // URL 파라미터에서 busNumber 가져오기
  const [stations, setStations] = useState([]); // 정류장 목록
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    // 버스 정류장 목록 가져오기
    const fetchBusStations = async () => {
      try {
        const response = await axios.get(`http://DevSe.gonetis.com:12599/api/bus/${busNumber}`);
        setStations(response.data.data?.stations || []); // 정류장 목록 저장
      } catch (error) {
        console.error("정류장 목록을 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchBusStations();
  }, [busNumber]);

  // 로딩 중일 때
  if (loading) return <p>로딩 중입니다...</p>;

  return (
    <div className={styles.BusRoutePage}>
      <h2>{busNumber}번 버스 정류장 목록</h2>
      <ul>
        {stations && stations.length > 0 ? (
          stations.map((station, index) => (
            <li key={index}>{station.stationName}</li>
          ))
        ) : (
          <p>정류장 정보가 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default BusRoutePage;
