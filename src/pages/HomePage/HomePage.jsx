import React from "react";
import Footer from "components/Footer/Footer";
import styles from "./HomePage.module.css";
import SearchBar from "components/SearchBar/SearchBar";
import StationList from "components/StationList/StationList";
import MapView from "../../components/MapView/MapView";

function HomePage() {
  return (
    <div className={styles}>
      <div className={styles.body}>
        <SearchBar />
        <div className={styles.mapView}><MapView /></div>
        <div className={styles.stationList}><StationList /></div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;