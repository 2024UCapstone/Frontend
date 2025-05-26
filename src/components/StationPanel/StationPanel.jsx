import React, { useState, useEffect } from "react";
import styles from "./StationPanel.module.css";
import useHeightStore, { useHeightState } from "store/UseHeightStore";
import StationDetail from "components/StationDetail/StationDetail";
import StationList from "components/StationList/StationList";
import DraggablePanel from "components/DraggablePanel/DraggablePanel";
import { useMapActions } from "store/UseMapStore";
import useSelectedStationStore from "store/UseSelectedStationStore";
import { useNavigate } from "react-router";

export default function StationPanel({ 
  openSearchStationModal, 
  favoriteStations, 
  toggleFavorite 
}) {
  const { tabHeight } = useHeightState();
  const { resetMapState } = useMapActions();
  const { selectedStation, resetSelectedStation } = useSelectedStationStore();
  const contentHeight = tabHeight - 12;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(2);

  // selectedStation이 변경될 때마다 타이머와 상태 초기화
  useEffect(() => {
    // 상태 초기화
    setIsButtonEnabled(false);
    setRemainingTime(2);

    let timer;
    
    // selectedStation이 있을 때만 타이머 시작
    if (selectedStation !== null) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsButtonEnabled(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // 클린업 함수
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [selectedStation]); // selectedStation이 변경될 때마다 실행

  function handleBackBtn() {
    if (isButtonEnabled) {
      resetSelectedStation();
      resetMapState();
    }
  }

  const backButtonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: isButtonEnabled ? '#007bff' : '#cccccc',
    color: 'white',
    cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  };

  return (
    <DraggablePanel>
      <div 
        className={styles.stationListBody} 
        style={{ height: `${contentHeight}px` }}
      >
        <div className={styles.stationListContainer}>
          <div className={styles.stationListHeader}>
            {selectedStation !== null && (
              <button 
                onClick={handleBackBtn}
                style={backButtonStyle}
                disabled={!isButtonEnabled}
              >
                {isButtonEnabled ? (
                  "뒤로 가기"
                ) : (
                  <>
                    {remainingTime}초 후 활성화
                  </>
                )}
              </button>
            )}
            <span className={styles.stationListTitle}>
              {selectedStation ? selectedStation.name : '정류장'}
            </span>
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
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </div>
    </DraggablePanel>
  );
}