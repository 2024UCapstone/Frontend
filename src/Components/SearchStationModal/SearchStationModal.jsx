import React, { useEffect, useRef, useState } from 'react';
import styles from './SearchStationModal.module.css';
import useFetchData from 'hooks/useFetchData';
import LoadingPage from 'pages/LoadingPage/LoadingPage';
import { useEnterKey } from 'hooks/useEnterKey';
import { useModalActions } from 'store/UseModalStore';

const SearchStationModal = ({ selectedStation, setSelectedStation, isOpen, toggleModal, favoriteStations, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: stationData, load: stationLoad, error: stationError, fetchData: stationFetchData } = useFetchData("http://devse.gonetis.com:12599/api/station");
  const searchInputRef = useRef(null);
  const {selectedModalClose} = useModalActions();
  useEnterKey(searchInputRef, () => handleSearch(searchTerm));

  const handleSearch = async (stationName) => {
    setIsLoading(true);
    try {
      const endpoint = `https://DevSe.gonetis.com/api/station?name=${stationName}`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("정류장 검색에 실패했습니다.");
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    stationFetchData();
  }, []);

  useEffect(() => {
    if (stationData && stationData.data) {
      setSearchResults(stationData.data);
    }
  }, [stationData]);

  if (!isOpen) return null;
  if (stationLoad || isLoading) return <LoadingPage />;
  if (stationError || error) return <div>에러가 발생했습니다.</div>;

  return (
    <div className={styles.SearchModal} onClick={toggleModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>정류장 검색</h3>
        <input
          type="text"
          placeholder="검색할 정류장 이름 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={searchInputRef}
        />
        <ul className={styles.busStopList}>
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((station) => (
              <li key={station.id} className={styles.busStopItem} onClick={()=>{
                setSelectedStation(station)
                toggleModal();
                }}>
                {station.name}
                <button
                  className={`${styles.favoriteButton} ${favoriteStations?.some(fs => fs.id === station.id) ? styles.active : ''}`}
                  onClick={() => toggleFavorite(station.id)}
                >
                  {favoriteStations?.some(fs => fs.id === station.id) ? '★' : '☆'}
                </button>
              </li>
            ))
          ) : (
            <li>검색 결과가 없습니다.</li>
          )}
        </ul>
        <button onClick={toggleModal} className={styles.closeModal}>닫기</button>
      </div>
    </div>
  );
};

export default SearchStationModal;