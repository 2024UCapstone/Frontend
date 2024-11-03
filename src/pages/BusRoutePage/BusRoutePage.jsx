import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import styles from "./BusRoutePage.module.css";
import Footer from "components/Footer/Footer";
import useSelectedStationStore from "store/UseSelectedStationStore";
import { useMapActions } from "store/UseMapStore";

function BusRoutePage() {
  const navigate = useNavigate();
  const { setCenter } = useMapActions();
  const [stationList, setStationList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSelectedStation } = useSelectedStationStore();

  // 정류장 목록 불러오기
  useEffect(() => {
    const fetchStationList = async () => {
      try {
        const response = await axios.get(
          "https://DevSe.gonetis.com/api/station"
        );
        setStationList(response.data.data);
      } catch (error) {
        console.error("정류장 목록을 불러오는 중 오류 발생:", error);
      }
    };
    fetchStationList();
  }, []);

  // 정류장 클릭 시 위치 정보 가져와서 모달 열기
  const handleStationClick = (station) => {
    setCenter(station.location.x, station.location.y);
    setSelectedStation(station);
    navigate("/home");
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
          <li
            key={station.id}
            className={styles.stationItem}
            onClick={() => handleStationClick(station)}
          >
            <span className={styles.dot}></span>
            <span>{station.name}</span>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default BusRoutePage;
