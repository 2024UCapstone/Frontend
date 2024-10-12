import React, { useState } from 'react';
import styles from './SearchStationModal.module.css';

const SearchStationModal = ({ isOpen, toggleModal, stations, favoriteStations, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.SearchModal} onClick={toggleModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>정류장 검색</h3>
        <input
          type="text"
          placeholder="검색할 정류장 이름 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className={styles.busStopList}>
          {filteredStations.map((station) => (
            <li key={station.id} className={styles.busStopItem}>
              {station.name}
              <button
                className={`${styles.favoriteButton} ${favoriteStations.some(fs => fs.id === station.id) ? styles.active : ''}`}
                onClick={() => toggleFavorite(station.id)}
              >
                {favoriteStations.some(fs => fs.id === station.id) ? '★' : '☆'}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={toggleModal} className={styles.closeModal}>닫기</button>
      </div>
    </div>
  );
};

export default SearchStationModal;