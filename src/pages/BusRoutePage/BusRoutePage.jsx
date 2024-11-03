import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BusRoutePage.module.css";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Footer from "components/Footer/Footer";

function BusRoutePage() {
  const [stationList, setStationList] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 정류장 목록 불러오기
  useEffect(() => {
    const fetchStationList = async () => {
      try {
        const response = await axios.get("https://DevSe.gonetis.com/api/station");
        setStationList(response.data.data);
      } catch (error) {
        console.error("정류장 목록을 불러오는 중 오류 발생:", error);
      }
    };
    fetchStationList();
  }, []);

  // 정류장 클릭 시 위치 정보 가져와서 모달 열기
  const handleStationClick = async (stationName) => {
    try {
      const response = await axios.get(`https://DevSe.gonetis.com/api/station?stationName=${stationName}`);
      const stationData = response.data.data.find((station) => station.name === stationName);
      if (stationData) {
        setSelectedStation(stationData.location);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("정류장 위치 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
  };

  return (
    <div className={styles.BusRoutePage}>
      <h3>울산과학대의 정류장 목록</h3>
      <ul className={styles.stationList}>
        {stationList.map((station) => (
          <li key={station.id} className={styles.stationItem} onClick={() => handleStationClick(station.name)}>
            <span className={styles.dot}></span>
            <span>{station.name}</span>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>✕</button>
            {selectedStation && (
              <Map
                center={{ lat: selectedStation.coordinates[0], lng: selectedStation.coordinates[1] }}
                style={{ width: "100%", height: "400px" }}
                level={4}
              >
                <MapMarker position={{ lat: selectedStation.coordinates[0], lng: selectedStation.coordinates[1] }} />
              </Map>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default BusRoutePage;
