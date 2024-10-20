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
  
  const BASE_URL = "http://devse.gonetis.com:12599";

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
        setStations(busData.stations.map(station => ({
          id: station.stationRef.id, // stationRef에서 id 추출
          name: station.stationName,  // stationName 사용
        })));

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

  // 정류장 삭제 핸들러 (인덱스로 삭제)
  const handleDeleteStation = (index) => {
    setStations((prevStations) => {
      const updatedStations = prevStations.filter((_, i) => i !== index);
  
      console.log("Remaining stations after delete:", updatedStations); // 삭제 후 남은 정류장 출력
  
      return updatedStations; // 상태를 업데이트
    });
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
      await axios.put(`${BASE_URL}/api/bus/${busNumber}`, {
        busNumber: busNumberInput,
        stationNames: stations.map((station) => station.name), // 정류장 이름 배열 전송
        totalSeats: Number(totalSeats), // 좌석 수 전송
      });
      alert("버스가 성공적으로 수정되었습니다.");
      navigate("/bus-list"); // 수정 후 버스 목록 페이지로 이동
    } catch (error) {
      console.error("버스 수정 실패:", error);
      alert("버스 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.AdminBusEditPage}>
      <h2>버스 수정하기</h2>
  
      {/* 현재 stations 리스트 출력 */}
      {/* <div className={styles.remainingStations}>
        <h3>남아 있는 정류장 리스트:</h3>
        {stations.length > 0 ? (
          <ul>
            {stations.map((station, index) => (
              <li key={index}>{station.name}</li>
            ))}
          </ul>
        ) : (
          <p>정류장이 없습니다.</p>
        )}
      </div> */}
  
      {/* 기존 삭제 및 수정 코드 */}
      <div className={styles.stationList}>
        {stations.length > 0 ? (
          stations.map((station, index) => (
            <div key={station.id} className={styles.stationItem}>
              {station.name}
              <button className={styles.editButton} onClick={() => handleEditStation(index)}>
                수정
              </button>
              <button className={styles.deleteButton} onClick={() => handleDeleteStation(index)}>
                삭제
              </button>
            </div>
          ))
        ) : (
          <p>정류장이 없습니다.</p> // 정류장이 없을 때 메시지 출력
        )}
      </div>

  
      <button onClick={() => setModalIsOpen(true)} className={styles.addStationButton}>+</button>
  
      {/* 저장 및 취소 버튼 */}
      <div className={styles.buttonContainer}>
        <button className={styles.saveButton} onClick={handleSubmit}>저장</button>
        <button className={styles.cancelButton} onClick={() => navigate("/bus-list")}>취소</button>
      </div>
    </div>
  );  
}

export default AdminBusEditPage;
