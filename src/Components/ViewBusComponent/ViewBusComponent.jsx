import React, { useState } from "react";
import { useNavigate } from "react-router";
import SearchStationModal from "components/SearchStationModal/SearchStationModal";
import styles from "./ViewBusComponent.module.css";
import ScrollHandler from "./ScrollHandler/ScrollHandler";

export default function ViewBusComponent() {
  const [stations, setStations] = useState([
    { name: "중부경찰서", favorite: true, id: 1 },
    { name: "동부캠퍼스 로터리", favorite: true, id: 2 },
    { name: "성남동", favorite: false, id: 3 },
    { name: "태화로터리", favorite: false, id: 4 },
    { name: "우정동", favorite: false, id: 5 },
  ]);

  const [selectedStation, setSelectedStation] = useState(null);
  const [serchmodalOpen, setSerchModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleFavorite = (stopName) => {
    const updatedStops = stations.map((stop) =>
      stop.name === stopName ? { ...stop, favorite: !stop.favorite } : stop
    );
    setStations(updatedStops);
  };

  const favoriteStations = stations.filter((station) => station.favorite);
  const emptySlots = Array.from({ length: Math.max(4 - favoriteStations.length, 0) });

  const toggleModal = () => setSerchModalOpen(!serchmodalOpen);

  return (
    <ScrollHandler>
      <div className={styles.body}>
        <div className={styles.stationListContainer}>
          <div className={styles.stationListHeaderContainer}>
            <span className={styles.stationListTitle}>정류장</span>
            <span className={styles.searchIcon} onClick={toggleModal}>
              🔍
            </span>
          </div>

          <div className={styles.stationListItemContainer}>
            {favoriteStations.length === 0 ? (
              <div className={styles.stationListItem}>즐겨찾는 정류장이 없습니다. 정류장을 등록해 주세요.</div>
            ) : (
              favoriteStations.map((station, index) => (
                <div
                  key={index}
                  className={`${styles.stationListItem} ${selectedStation?.id === station.id ? styles.selected : ""}`}
                  onClick={() => {
                    setSelectedStation(station);
                    navigate("/detailfavoriteslist");
                  }}
                >
                  {station.name}
                  <span
                    className={styles.star}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station.name);
                    }}
                  >
                    {station.favorite ? "★" : "☆"}
                  </span>
                </div>
              ))
            )}
            {emptySlots.slice(favoriteStations.length === 0 ? 1 : 0).map((_, index) => (
              <div key={index} className={styles.stationListEmpty}></div>
            ))}
          </div>
        </div>
        <SearchStationModal
          isOpen={serchmodalOpen}
          toggleModal={toggleModal}
          stations={stations}
          toggleFavorite={toggleFavorite}
        />
      </div>
    </ScrollHandler>
  );
}