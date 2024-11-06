import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AdminBusListPage.module.css";
import Footer from "components/Footer/Footer";

function AdminBusListPage() {
  const [busList, setBusList] = useState([]); // 버스 목록
  const [showBusButtons, setShowBusButtons] = useState(null); // 수정/삭제 버튼 표시 여부
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const navigate = useNavigate();

  // 버스 목록 가져오기 (GET 요청)
  useEffect(() => {
    const fetchBusList = async () => {
      try {
        const response = await axios.get("https://DevSe.gonetis.com/api/bus");
        setBusList(response.data); // 서버에서 받은 데이터를 상태에 저장
        console.log("response.data", response.data);
      } catch (error) {
        console.error("버스 목록을 가져오는 중 오류 발생:", error);
      }
    };
    fetchBusList();
  }, []);

  // 버스 수정 페이지로 이동
  const handleBusEdit = (busNumber) => {
    navigate(`edit/${busNumber}`);
  };

  // 버스 삭제 (DELETE 요청)
  const handleBusDelete = async (busNumber) => {
    try {
      await axios.delete(`https://DevSe.gonetis.com/api/bus/${busNumber}`);

      // 삭제된 버스를 목록에서 바로 제거
      setBusList((prevBusList) => ({
        ...prevBusList,
        data: prevBusList.data.filter((bus) => bus.busNumber !== busNumber),
      }));
    } catch (error) {
      console.error("버스 삭제 중 오류 발생:", error);
    }
  };

  // 수정/삭제 버튼 표시/숨김 토글
  const toggleBusButtons = (bus) => {
    setShowBusButtons((prev) => (prev === bus ? null : bus));
  };

  return (
    <div className={styles.AdminBusListPage}>
      <h2>버스 목록</h2>
      <div className={styles["searchBar"]}>
        <input
          type="text"
          placeholder="정류장을 검색하세요"
          value={searchTerm} // 입력값을 상태와 연결
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
        />
        <button className={styles["searchButton"]}>🔍</button>
      </div>
      <div className={styles.busList}>
        {/* busList가 존재하고, data 속성이 배열인지 확인한 후에 map을 실행 */}
        {busList.data &&
        Array.isArray(busList.data) &&
        busList.data.length > 0 ? (
          busList.data.map((bus) => (
            <div
              key={bus.busNumber}
              className={styles.busItem}
              onClick={() => toggleBusButtons(bus)}
            >
              {bus.busNumber}
              {showBusButtons === bus && (
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => handleBusEdit(bus.busNumber)}
                    className={styles.editButton}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleBusDelete(bus.busNumber)}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noBuses}>등록된 버스가 없습니다.</p>
        )}
      </div>
      <button
        onClick={() => navigate("create")}
        className={styles.registerButton}
      >
        버스 등록
      </button>
      <Footer />
    </div>
  );
}

export default AdminBusListPage;
