import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BusListPage.module.css";
import { BusIcon } from "assets/images";
import Footer from "components/Footer/Footer";
import axios from "axios";

function BusListPage() {
  const [busList, setBusList] = useState([]); // 버스 목록
  const navigate = useNavigate();

  // 버스 목록 가져오기 (GET 요청)
  useEffect(() => {
    const fetchBusList = async () => {
      try {
        const response = await axios.get('http://DevSe.gonetis.com:12599/api/bus');
        setBusList(response.data); // 서버에서 받은 데이터를 상태에 저장
        console.log("response.data", response.data)
      } catch (error) {
        console.error('버스 목록을 가져오는 중 오류 발생:', error);
      }
    };
    fetchBusList();
  }, []);

  console.log("busList", busList)
  // 버스 상세 페이지로 이동
  const goToBusDetail = (busNumber) => {
    console.log(busNumber)
    navigate(`/bus-list/${busNumber}`);
  };

  return (
    <div className={styles.BusListPage}>
      {/* 현 34rem으로 지정 */}
      <h3>{"울산과학대의 버스 목록"}</h3>
      <ul>
        <div className={styles.busList}>
        {busList.data && Array.isArray(busList.data) && busList.data.length > 0 ? (
          busList.data.map((bus) => (
            <li onClick={() => goToBusDetail(bus.busNumber)}>
              <img src={BusIcon} alt="bus icon" />
              <div key={bus.busNumber} className={styles.busItem}>
                {bus.busNumber}
              </div>
            </li>
          ))
        ) : (
          <p className={styles.noBuses}>등록된 버스가 없습니다.</p>
        )}
      </div>
      </ul>
      <Footer />
    </div>
  );
}

export default BusListPage;
