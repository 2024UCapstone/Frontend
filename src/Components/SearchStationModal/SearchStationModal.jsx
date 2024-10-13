import React, { useEffect, useState } from 'react';
import styles from './SearchStationModal.module.css';
import useFetchData from 'hooks/useFetchData';
import LoadingPage from 'pages/LoadingPage/LoadingPage';

const SearchStationModal = ({ isOpen, toggleModal, favoriteStations, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stationData, load: stationLoad, error: stationError, fetchData: stationFetchData } = useFetchData("http://devse.gonetis.com:12599/api/station");

  useEffect(()=>{
    stationFetchData();
  }, [])
  if (!isOpen) return null;

  if (stationLoad) return <LoadingPage/>;
  if (stationError) return <div>에러가 발생했습니다.</div>;


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
          {stationData?.data?.map((station) => (
            <li key={station.id} className={styles.busStopItem}>
              {station.name}
              <button
                className={`${styles.favoriteButton} ${favoriteStations?.some(fs => fs.id === station.id) ? styles.active : ''}`}
                onClick={() => toggleFavorite(station.id)}
              >
                {favoriteStations?.some(fs => fs.id === station.id) ? '★' : '☆'}
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