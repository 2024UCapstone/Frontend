import React, { useState, useEffect } from "react";
import styles from "./StationPanel.module.css";
import useHeightStore, { useHeightState } from "store/UseHeightStore";
import StationDetail from "components/StationDetail/StationDetail";
import StationList from "components/StationList/StationList";
import DraggablePanel from "components/DraggablePanel/DraggablePanel";
import { useMapActions } from "store/UseMapStore";
import useSelectedStationStore from "store/UseSelectedStationStore";

export default function StationPanel({ openSearchStationModal, favoriteStations, toggleFavorite }) {
  const { tabHeight } = useHeightState();
  const { resetMapState } = useMapActions();
  const { selectedStation, setSelectedStation } = useSelectedStationStore();

  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };

  const contentHeight = tabHeight - 12;

  return (
    <DraggablePanel>
      <div className={styles.stationListBody} style={{ height: `${contentHeight}px` }}>
        <div className={styles.stationListContainer}>
          <div className={styles.stationListHeader}>
            {selectedStation !== null &&
              <button onClick={() => {
                setSelectedStation(null);
                resetMapState();
                window.location.reload();
              }}>back</button>
            }
            <span className={styles.stationListTitle}>{selectedStation ? selectedStation.name : '정류장'}</span>
            <button
              className={styles.searchButton}
              aria-label="검색"
              onClick={openSearchStationModal}
            >
              <svg
                className={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          {selectedStation !== null ? (
            <StationDetail />
          ) : (
            <StationList 
              favoriteStations={favoriteStations}
              onStationSelect={handleStationSelect}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </div>
    </DraggablePanel>
  );
}