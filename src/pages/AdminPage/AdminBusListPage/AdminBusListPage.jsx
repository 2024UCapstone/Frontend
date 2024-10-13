import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AdminBusListPage.module.css';
import Footer from 'components/Footer/Footer';

function AdminBusListPage() {
  const [busList, setBusList] = useState([]); // 버스 목록
  const [showBusButtons, setShowBusButtons] = useState(null); // 수정/삭제 버튼 표시 여부
  const navigate = useNavigate();

  // 버스 목록 가져오기 (GET 요청)
  useEffect(() => {
    const fetchBusList = async () => {
      try {
        const response = await axios.get('http://DevSe.gonetis.com:12599/api/bus');
        setBusList(response.data); // 서버에서 받은 데이터를 상태에 저장
      } catch (error) {
        console.error('버스 목록을 가져오는 중 오류 발생:', error);
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
      await axios.delete(`http://DevSe.gonetis.com:12599/api/bus/${busNumber}`);
      setBusList(busList.filter(bus => bus.number !== busNumber)); // 삭제 후 목록에서 제거
    } catch (error) {
      console.error('버스 삭제 중 오류 발생:', error);
    }
  };

  // 수정/삭제 버튼 표시/숨김 토글
  const toggleBusButtons = (bus) => {
    setShowBusButtons((prev) => (prev === bus ? null : bus));
  };

  return (
    <div className={styles.AdminBusListPage}>
      <h2>버스 목록</h2>
      <div className={styles.busList}>
        {busList.length === 0 ? (
          <p>등록된 버스가 없습니다.</p>
        ) : (
          busList.map((bus) => (
            <div key={bus.number} className={styles.busItem} onClick={() => toggleBusButtons(bus)}>
              {bus.number}번 버스
              {showBusButtons === bus && (
                <div className={styles.busButtons}>
                  <button onClick={() => handleBusEdit(bus.number)} className={styles.editButton}>수정</button>
                  <button onClick={() => handleBusDelete(bus.number)} className={styles.deleteButton}>삭제</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <button onClick={() => navigate('register')} className={styles.registerButton}>
        버스 등록
      </button>
      <Footer />
    </div>
  );
}

export default AdminBusListPage;
