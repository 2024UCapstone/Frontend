import React from "react";
import styles from "./AdminPage.module.css"; // 모듈 CSS를 import
import { useNavigate } from "react-router-dom";
import Footer from "components/Footer/Footer";
import { BusStopIcon, BusIcon } from "assets/images";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.AdminPage}>
      <div className={styles.header}>관리자 페이지</div>
      <div
        className={styles.busStopButton}
        onClick={() => navigate("bus-station")}
      >
        <img
          src={BusStopIcon}
          alt="정류장 아이콘"
          className={styles.buttonIcon}
        />
        정류장
      </div>
      <div className={styles.busButton} onClick={() => navigate("bus")}>
        <img src={BusIcon} alt="버스 아이콘" className={styles.buttonIcon} />
        버스
      </div>
      <Footer className={styles.footer} />
    </div>
  );
}

export default AdminPage;
