import React from "react";
import styles from "./LoadingPage.module.css";
import { BusIcon } from "assets/images";

const LoadingPage = () => {
  return (
    <div className={styles["loadingPage"]}>
      <div className={styles["logo"]}>
        <img className={styles["bus-icon"]} src={BusIcon} alt="Bus Logo" />
      </div>
      <div className={styles["bus-icon"]}>로딩중....</div>
    </div>
  );
};

export default LoadingPage;
