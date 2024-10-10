import React from "react";
import styles from "./StationList.module.css";
import { useMapActions } from "store/UseMapStore";

export default function StationList({favoriteStations, selectedStation, onStationSelect, toggleFavorite}) {
  const {setCenter} = useMapActions();

  return (
    <div className={styles.stationListItems}>
    {favoriteStations && favoriteStations?.length === 0 ? (
      <div className={styles.stationListItem}>즐겨찾는 정류장이 없습니다. 정류장을 등록해 주세요.</div>
    ) : (
      favoriteStations && favoriteStations?.map((station) => (
        <div
          key={station.id}
          className={`${styles.stationListItem} ${selectedStation?.id === station.id ? styles.selected : ""}`}
          onClick={() => {
            onStationSelect(station);
            setCenter(station.location.x, station.location.y);
          }}
        >
          {station.name}
          <span
            className={styles.star}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(station.id);
            }}
          >
            ★
          </span>
        </div>
      ))
    )}
  </div>
  );
}