import React from "react";
import styles from "./CommonSearchBarModule.module.css";

const CommonSearchBarModule = ({ searchTerm, setSearchTerm, onSearch, onFocus }) => {
  return (
    <div className={styles.searchBarWrapper}>
      <input
        className={styles.searchInput}
        placeholder="검색할 정류장을 입력해주세요."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={onFocus} // SearchBar가 활성화될 때 호출
      />
      <button
        className={styles.searchButton}
        aria-label="검색"
        onClick={() => onSearch(searchTerm)}
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
  );
};

export default CommonSearchBarModule;