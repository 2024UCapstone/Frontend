import React, { useState, useEffect, useRef } from "react";
import styles from "./FullScreenSearchModal.module.css";
import CommonSearchBarModule from "../CommonSearchBarModule/CommonSearchBarModule";
import { useCloseOnEsc } from "../../../hooks/useCloseOnEsc";
import { useEnterKey } from "../../../hooks/useEnterKey";
import { useMapActions } from "store/UseMapStore";
import useSelectedStationStore from "store/UseSelectedStationStore";

const FullScreenSearchModal = ({
  isOpen,
  onClose,
  initialValue,
  onSearch,
  searchResults,
  isLoading,
  error,
  toggleFavorite
}) => {
  const [searchStationName, setSearchStationName] = useState(initialValue);
  const searchInputRef = useRef(null);
  const { setCenter } = useMapActions();
  const { setSelectedStation } = useSelectedStationStore();

  useCloseOnEsc(onClose); // ESC로 모달 닫기
  useEnterKey(searchInputRef, () => onSearch(searchStationName)); // Enter로 검색


  useEffect(() => {
    setSearchStationName(initialValue);
  }, [initialValue]);

  const handleStationClick = (station) => {
    setSelectedStation(station);
    onClose(); // 모달 닫기
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <CommonSearchBarModule
          searchStationName={searchStationName}
          setSearchStationName={setSearchStationName}
          onSearch={onSearch}
          inputRef={searchInputRef} // inputRef 전달
        />
        <div className={styles.resultContainer}>
          {isLoading && <div className={styles.loadingMessage}>검색 중...</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}
          {!isLoading && !error && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className={styles.searchResultItem}
                  onClick={() => handleStationClick(result)}
                >
                  {result.name}
                </div>
              ))}
            </div>
          )}
          {!isLoading && !error && searchResults.length === 0 && (
            <div className={styles.noResults}>검색 결과가 없습니다.</div>
          )}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default FullScreenSearchModal;
