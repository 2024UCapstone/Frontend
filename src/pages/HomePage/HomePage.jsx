import React from "react";
import KakaoMap from "../../components/KakaoMap/KakaoMap";
import Footer from "components/Footer/Footer";
import styles from "./HomePage.module.css";
import SearchBar from "components/SearchBar/SearchBar";
import ViewBusComponent from "components/ViewBusComponent/ViewBusComponent";

function HomePage() {
  return (
    <div className={styles.body}>
      <div className={styles.searchBar}><SearchBar /></div>
      <div className={styles.kakaomap}><KakaoMap /></div>
      <ViewBusComponent />
      <Footer />
    </div>
  );
}

export default HomePage;