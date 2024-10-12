import React, { useEffect, useState } from "react";
import Footer from "components/Footer/Footer";
import styles from "./HomePage.module.css";
import SearchBar from "components/SearchBar/SearchBar";
import MapView from "../../components/MapView/MapView";
import { useLocation, useNavigate } from "react-router";
import StationPanel from "../../components/StationPanel/StationPanel";
import SearchStationModal from "../../components/SearchStationModal/SearchStationModal";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchStationModalOpen, setIsSearchStationModalOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [favoriteStations, setFavoriteStations] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate(location.pathname, { replace: true });
      navigate('/home');
    }
    // 여기에 stations와 favoriteStations를 가져오는 로직 추가
  }, [location, navigate]);

  const toggleFavorite = (stationId) => {
    // 즐겨찾기 토글 로직 구현
  };

  return (
    <div className={styles.body}>
      <div className={styles.searchBar}><SearchBar /></div>
      <div className={styles.mapView}><MapView /></div>
      <StationPanel 
        openSearchStationModal={() => setIsSearchStationModalOpen(true)}
        stations={stations}
        favoriteStations={favoriteStations}
        toggleFavorite={toggleFavorite}
      />
      <SearchStationModal
        isOpen={isSearchStationModalOpen}
        toggleModal={() => setIsSearchStationModalOpen(false)}
        stations={stations}
        favoriteStations={favoriteStations}
        toggleFavorite={toggleFavorite}
      />
      <Footer />
    </div>
  );
}

export default HomePage;