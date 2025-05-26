import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // useParams로 URL 파라미터에서 busNumber 가져오기
import Footer from "components/Footer/Footer";
import styles from "./AdminBusEditPage.module.css";

function AdminBusEditPage() {
  const { busNumber } = useParams(); // URL 파라미터에서 busNumber 가져옴
  const navigate = useNavigate();

  const [busDetails, setBusDetails] = useState(null); // 버스 세부 정보 상태
  const [busNumberInput, setBusNumberInput] = useState(""); // 버스 번호 입력 상태
  const [stations, setStations] = useState([]); // 정류장 리스트
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [allStations, setAllStations] = useState([]); // 모든 정류장 리스트
  const [filteredStations, setFilteredStations] = useState([]); // 검색된 정류장 리스트
  const [totalSeats, setTotalSeats] = useState(""); // 좌석 수
  const [searchTerm, setSearchTerm] = useState(""); // 모달 내 검색어 상태
  const [editingIndex, setEditingIndex] = useState(null); // 수정할 정류장의 인덱스

  const BASE_URL = "https://bbbserver.devse.kr";

  // 페이지가 로드되면 해당 버스 데이터를 서버에서 가져옴
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        // 버스 데이터 불러오기
        const response = await axios.get(`${BASE_URL}/api/bus/${busNumber}`);
        const busData = response.data.data;
        setBusDetails(busData);

        // 입력 필드에 서버로부터 받은 데이터를 세팅
        setBusNumberInput(busData.busNumber);
        setTotalSeats(busData.totalSeats);

        // 정류장 데이터를 변환해 설정
        setStations(
          busData.stations.map((station) => ({
            id: station.stationRef.id, // stationRef에서 id 추출
            name: station.stationName, // stationName 사용
          }))
        );

        // 모든 정류장 데이터를 가져옴 (모달에서 사용)
        const stationResponse = await axios.get(`${BASE_URL}/api/station`);
        setAllStations(stationResponse.data.data); // 모든 정류장 리스트 저장
        setFilteredStations(stationResponse.data.data); // 검색을 위한 데이터 초기화
      } catch (error) {
        console.error("버스 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchBusDetails();
  }, [busNumber]);

  // 버스 번호 입력 핸들러
  const handleBusNumberChange = (e) => {
    setBusNumberInput(e.target.value);
  };

  // 좌석 수 입력 핸들러 (숫자만 입력 가능)
  const handleTotalSeatsChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[1-9]\d*$/.test(inputValue)) {
      setTotalSeats(inputValue);
    }
  };

  // 정류장 추가/수정 핸들러 (모달에서 정류장 선택)
  const handleAddStation = (station) => {
    if (editingIndex !== null) {
      // 수정 모드일 때
      const updatedStations = [...stations];
      updatedStations[editingIndex] = station; // 선택한 인덱스의 정류장을 수정
      setStations(updatedStations);
      setEditingIndex(null); // 수정 모드 해제
    } else {
      // 추가 모드일 때
      setStations([...stations, { ...station, id: Date.now().toString() }]);
    }
    setModalIsOpen(false); // 모달 닫기
  };

  // 정류장 삭제 핸들러 (인덱스를 통해 삭제)
  const handleDeleteStation = (index) => {
    const updatedStations = stations.filter((_, i) => i !== index);
    setStations(updatedStations);
  };

  // 정류장 수정 핸들러 (수정할 정류장의 인덱스를 저장하고 모달 열기)
  const handleEditStation = (index) => {
    setEditingIndex(index); // 수정할 정류장의 인덱스를 저장
    setModalIsOpen(true); // 모달 열기
  };

  // 모달 내 정류장 검색 핸들러
  const handleModalSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredStations(
      allStations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm)
      )
    );
  };

  // 버스 수정 핸들러
  const handleSubmit = async () => {
    if (!busNumberInput || stations.length === 0 || totalSeats === "") {
      alert("버스 번호, 좌석 수, 정류장을 모두 입력해주세요.");
      return;
    }

    try {
      // 전송 데이터 확인용 콘솔 출력
      const stationNames = stations.map((station) => station.name);
      console.log("Sending stationNames:", stationNames); // 리스트 형태 확인용
      console.log("busNumberInput", busNumberInput);
      console.log("ID", busDetails.id);
      await axios.put(
        `${BASE_URL}/api/bus`,
        JSON.stringify({
          id: busDetails.id,
          busNumber: busNumberInput,
          totalSeats: Number(totalSeats), // 좌석 수 전송
          stationNames: stations.map((station) => station.name), // 정류장 이름 배열 전송
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("버스가 성공적으로 수정되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("버스 수정 실패:", error);
      alert("버스 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.AdminBusEditPage}>
      <h2>버스 수정하기</h2>
      {busDetails ? (
        <>
          <input
            type="text"
            placeholder="버스 번호를 입력하세요"
            value={busNumberInput}
            onChange={handleBusNumberChange}
            className={styles.busNumberInput}
          />

          <input
            type="number"
            placeholder="좌석 수를 입력하세요"
            value={totalSeats}
            onChange={handleTotalSeatsChange}
            className={styles.totalSeatsInput}
            min="1" // 최소 1 이상의 숫자 입력만 가능하게 설정
          />

          {/* 정류장 리스트 */}
          <div className={styles.stationList}>
            {stations.map((station, index) => (
              <div key={station.id} className={styles.stationItem}>
                {station.name}
                <button
                  className={styles.editButton}
                  onClick={() => handleEditStation(index)}
                >
                  수정
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteStation(index)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setModalIsOpen(true)}
            className={styles.addStationButton}
          >
            +
          </button>

          {/* 저장 및 취소 버튼 */}
          <div className={styles.buttonContainer}>
            <button className={styles.saveButton} onClick={handleSubmit}>
              저장
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => navigate(-1)}
            >
              취소
            </button>
          </div>

          <Footer />

          {/* 직접 구현한 모달 */}
          {modalIsOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
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
                      <li
                        key={station.id}
                        onClick={() => handleAddStation(station)}
                      >
                        {station.name}
                      </li>
                    ))
                  ) : (
                    <li>검색된 정류장이 없습니다.</li>
                  )}
                </ul>
                <button
                  onClick={() => setModalIsOpen(false)}
                  className={styles.closeModalButton}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>버스 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default AdminBusEditPage;
