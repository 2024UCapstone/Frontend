import React, { useState } from "react";
import useStore from "store/UseStore";
import styles from "./StationSearch.module.css"; // CSS module

const StationSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const stations = useStore((state) => state.stations);
  const setFilteredStations = useStore((state) => state.setStations);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = stations.filter((station) =>
      station.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="정류장을 검색하세요"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>🔍</button>
    </div>
  );
};

export default StationSearch;
