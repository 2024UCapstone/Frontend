import React, { useState, useEffect, useRef } from "react";
import CommonSearchBarModule from "./CommonSearchBarModule/CommonSearchBarModule";
import FullScreenSearchModal from "./FullScreenSearchModal/FullScreenSearchModal";
import { useCloseOnEsc } from "../../hooks/useCloseOnEsc";
import { useEnterKey } from "../../hooks/useEnterKey"; 

export default function SearchBar({selectedStation, setSelectedStation}) {
  const [searchStationName, setSearchStationName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const searchInputRef = useRef(null);

  useCloseOnEsc(() => setIsModalOpen(false)); // ESC로 모달 닫기
  useEnterKey(searchInputRef, () => handleSearch(searchStationName)); // Enter로 검색

  useEffect(() => {
    const updateSearchBarHeight = () => {
      const searchBarElement = document.querySelector(".searchBarWrapper");
      if (searchBarElement) {
        const height = searchBarElement.offsetHeight;
        setSearchBarHeight(height);
        document.body.style.paddingTop = `${height}px`;
      }
    };

    updateSearchBarHeight();
    window.addEventListener("resize", updateSearchBarHeight);

    return () => {
      window.removeEventListener("resize", updateSearchBarHeight);
    };
  }, []);

  const handleSearchBarFocus = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchStationName("");
  };

  const handleSearch = async (stationName) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `http://DevSe.gonetis.com:12599/api/station?name=${stationName}`;

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
      setSearchStationName(stationName);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonSearchBarModule
        searchStationName={searchStationName}
        setSearchStationName={setSearchStationName}
        onSearch={handleSearch}
        onFocus={handleSearchBarFocus}
        inputRef={searchInputRef} // inputRef 전달
      />
      <FullScreenSearchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValue={searchStationName}
        onSearch={handleSearch}
        setSelectedStation={setSelectedStation}
        searchResults={searchResults}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
