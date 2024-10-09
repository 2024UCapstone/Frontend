import React, { useState, useEffect } from "react";
import CommonSearchBarModule from "../CommonSearchBarModule/CommonSearchBarModule";
import styles from "./FullScreenSearchModal.module.css";

const FullScreenSearchModal = ({
  isOpen,
  onClose,
  initialValue,
  onSearch,
  searchResults,
  isLoading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <CommonSearchBarModule
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={onSearch}
        />
        {isLoading && <div className={styles.loadingMessage}>검색 중...</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {!isLoading && !error && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((result, index) => (
              <div key={index} className={styles.searchResultItem}>
                {result.name}
              </div>
            ))}
          </div>
        )}
        {!isLoading && !error && searchResults.length === 0 && (
          <div className={styles.noResults}>검색 결과가 없습니다.</div>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default FullScreenSearchModal;
