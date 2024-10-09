import React, { useState, useEffect } from "react";
import CommonSearchBarModule from "./CommonSearchBarModule/CommonSearchBarModule";
import FullScreenSearchModal from "./FullScreenSearchModal/FullScreenSearchModal";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchBarHeight, setSearchBarHeight] = useState(0);

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

  // SearchBar가 포커스될 때 모달을 활성화
  const handleSearchBarFocus = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (term) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = term
        ? "http://localhost:8085/api/station/search"
        : "http://localhost:8085/api/station/all";
      const requestBody = term ? { name: term } : {};
      const response = await fetch(endpoint, {
        method: term ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...(term && { body: JSON.stringify(requestBody) }),
      });
      if (!response.ok) {
        throw new Error("정류장 검색에 실패했습니다.");
      }
      const data = await response.json();
      setSearchResults(data);
      setSearchTerm(term);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonSearchBarModule
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onFocus={handleSearchBarFocus} // 포커스 시 모달을 여는 함수 전달
      />
      <FullScreenSearchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValue={searchTerm}
        onSearch={handleSearch}
        searchResults={searchResults}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
