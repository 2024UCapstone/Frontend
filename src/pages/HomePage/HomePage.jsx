import React from "react";
import Footer from "components/Footer/Footer";
import styles from "./HomePage.module.css";
import SearchBar from "components/SearchBar/SearchBar";
import StationList from "components/StationList/StationList";
import MapView from "../../components/MapView/MapView";

function HomePage() {
  return (
    <div className={styles.body}>
      <div className={styles.searchBar}><SearchBar /></div>
      <div className={styles.kakaomap}><MapView /></div>
      <StationList />
      <Footer />
    </div>
  );
}

export default HomePage;