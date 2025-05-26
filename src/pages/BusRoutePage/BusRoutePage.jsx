import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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

  //주소창 입력된 busNumber값 받아오기
  let { busNumber } = useParams();
  // 정류장 목록 불러오기
  useEffect(() => {
    const fetchStationList = async () => {
      try {
        const response = await axios.get(
          `https://bbbserver.devse.kr/api/bus/stationNames/${busNumber}`
        );
        setStationList(response.data.data);
      } catch (error) {
        console.error("정류장 목록을 불러오는 중 오류 발생:", error);
      }
    };
    fetchStationList();
  }, []);

  // 정류장 클릭 시 위치 정보 가져와서 모달 열기
  const handleStationClick = async (station) => {
    try {
      const response = await axios.get(
        `https://bbbserver.devse.kr/api/station?name=${station}`
      );
      const stationData = response.data.data;
      // Zustand 스토어에 저장
      setSelectedStation(...stationData);
      navigate("/home");
    } catch (error) {
      console.error("정류장 목록을 불러오는 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.BusRoutePage}>
      <h3><span style={{color: 'lightblue'}}>{busNumber} 버스</span>의 정류장</h3>
      <ul className={styles.stationList}>
        {stationList.map((station, idx) => (
          <li
            key={idx}
            className={styles.stationItem}
            onClick={() => handleStationClick(station)}
          >
            <span className={styles.dot}></span>
            <span>{station}</span>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default BusRoutePage;
