import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "components/Footer/Footer";
import styles from "./AdminBusCreatePage.module.css";

function AdminBusCreatePage() {
  const navigate = useNavigate();
  const [busNumber, setBusNumber] = useState("");
  const [stations, setStations] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [allStations, setAllStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [totalSeats, setTotalSeats] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingStationId, setEditingStationId] = useState(null);

  const handleBusNumberChange = (e) => {
    setBusNumber(e.target.value);
  };

  const handleTotalSeatsChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[1-9]\d*$/.test(inputValue)) {
      setTotalSeats(inputValue);
    }
  };

  const handleAddStation = (station) => {
    setStations([...stations, { ...station, id: Date.now().toString() }]);
    setModalIsOpen(false);
  };

  const openModal = async () => {
    try {
      const response = await axios.get(`https://devse.gonetis.com/api/station`);
      setAllStations(response.data.data);
      setFilteredStations(response.data.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("정류장 검색 실패:", error);
    }
  };

  const handleStationSort = (startIndex, endIndex) => {
    const newStations = Array.from(stations);
    const [reorderedItem] = newStations.splice(startIndex, 1);
    newStations.splice(endIndex, 0, reorderedItem);
    setStations(newStations);
  };

  const handleModalSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredStations(
      allStations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm)
      )
    );
  };

  const handleSubmit = async () => {
    if (!busNumber.trim()) {
      alert("버스 번호를 입력해주세요.");
      return;
    }

    if (totalSeats <= 0 || totalSeats === "") {
      alert("좌석 수는 1 이상의 숫자를 입력해주세요.");
      return;
    }

    if (stations.length === 0) {
      alert("정류장을 하나 이상 추가해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`https://devse.gonetis.com/api/bus`, {
        busNumber: busNumber,
        stationNames: stations.map((station) => station.name),
        totalSeats: Number(totalSeats),
      });
      alert("버스가 성공적으로 등록되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("버스 등록 실패:", error);
      alert("버스 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleEditStation = (id) => {
    setEditingStationId(id);
  };

  const handleUpdateStation = (id, newName) => {
    setStations(stations.map(station => 
      station.id === id ? { ...station, name: newName } : station
    ));
    setEditingStationId(null);
  };

  const handleRemoveStation = (id) => {
    setStations(stations.filter(station => station.id !== id));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text'));
    handleStationSort(dragIndex, dropIndex);
  };

  return (
    <div className={styles.AdminBusCreatePage}>
      <input
        type="text"
        placeholder="버스 번호를 입력하세요"
        value={busNumber}
        onChange={handleBusNumberChange}
        className={styles.busNumberInput}
      />

      <input
        type="number"
        placeholder="좌석 수를 입력하세요"
        value={totalSeats}
        onChange={handleTotalSeatsChange}
        className={styles.totalSeatsInput}
        min="1"
      />

      <ul className={styles.stationList}>
        {stations.map((station, index) => (
          <li 
            key={station.id} 
            className={styles.stationItem}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {editingStationId === station.id ? (
              <input
                type="text"
                value={station.name}
                onChange={(e) => handleUpdateStation(station.id, e.target.value)}
                onBlur={() => setEditingStationId(null)}
                autoFocus
              />
            ) : (
              <>
                {station.name}
                <div className={styles.stationActions}>
                  <button 
                    onClick={() => handleEditStation(station.id)}
                    className={styles.editButton}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleRemoveStation(station.id)}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={openModal} className={styles.addStationButton}>+</button>

      <div className={styles.buttonContainer}>
        <button
          className={styles.saveButton}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => navigate("/bus-list")}
        >
          취소
        </button>
      </div>

      <Footer />

      {modalIsOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>정류장 목록</h2>
            <input
              type="text"
              placeholder="정류장을 검색하세요"
              value={searchTerm}
              onChange={handleModalSearch}
              className={styles.modalSearchInput}
            />
            <ul className={styles.modalStationList}>
              {filteredStations.length > 0 ? (
                filteredStations.map((station) => (
                  <li key={station.id} onClick={() => handleAddStation(station)}>
                    {station.name}
                  </li>
                ))
              ) : (
                <li>검색된 정류장이 없습니다.</li>
              )}
            </ul>
            <button onClick={closeModal} className={styles.closeModalButton}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBusCreatePage;