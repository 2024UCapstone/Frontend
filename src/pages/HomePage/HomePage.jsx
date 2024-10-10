import React, { useEffect, useState } from "react";
import Footer from "components/Footer/Footer";
import styles from "./HomePage.module.css";
import SearchBar from "components/SearchBar/SearchBar";
import MapView from "../../components/MapView/MapView";
import { useLocation, useNavigate } from "react-router";
import StationPanel from "pages/StationPanel/StationPanel";
function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      
      // 토큰 파라미터를 URL에서 제거
      navigate(location.pathname, { replace: true });
      
      // 로그인 성공 후 처리 (예: 홈 페이지로 리다이렉트)
      navigate('/home');
    }
  }, [location, navigate]);


  return (
    <div className={styles}>
      <div className={styles.body}>
        <div className={styles.searchBar}><SearchBar /></div>
        <div className={styles.mapView}><MapView /></div>
        <div className={styles.stationList}><StationPanel/></div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;