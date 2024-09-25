import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './LoadingPage.module.css'; // CSS 파일에서 애니메이션 설정
import useStore from '../../store/UseStore';
import busIcon from "../../assets/Image/free-icon-bus-1168001.png";

const LoadingPage = () => {
  const navigate = useNavigate();
  const setBusStops = useStore(state => state.setBusStops);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 가상의 데이터를 생성
        const data = [
          { id: 1, name: '정류장 1' },
          { id: 2, name: '정류장 2' },
          { id: 3, name: '정류장 3' },
        ];
        // 3초 후에 데이터를 설정하고 페이지를 이동
        setTimeout(() => {
          setBusStops(data);
          navigate('/home');
        }, 3000); // 3초 대기
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [navigate, setBusStops]);

  return (
    <div className={styles["loadingPage"]}>
      <div className={styles["logo"]}>
        <img className={styles["bus-icon"]} src={busIcon} alt="Bus Logo" />
      </div>
      <div className={styles["bus-icon"]}>로딩중....</div>
    </div>
  );
};

export default LoadingPage;