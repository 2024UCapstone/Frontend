import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "./BusStationEditPage.module.css";
import { Map, MapMarker } from "react-kakao-maps-sdk"; // 카카오맵 SDK
import useStore from 'store/UseStore'; // Zustand 스토어 불러오기
import Footer from "components/Footer/Footer";

function BusStationEditPage() {
  const { stationId } = useParams(); // URL에서 stationId를 가져옴
  // const [stationName, setStationName] = useState("");
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  // const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const setIsLoading = useStore((state) => state.setIsLoading); // 로딩 상태 관리
  const setErrorMessage = useStore((state) => state.setErrorMessage); // 에러 메시지 상태
  const busStations = useStore((state) => state.busStations); // 전체 정류장 목록
  const [station, setStation] = useState(null); // 특정 정류장 상태
  const [stationName, setStationName] = useState(''); // 정류장 이름 상태
  // const [locationData, setLocationData] = useState(null); // 위치 데이터 상태
  const [locationData, setLocationData] = useState({
    lat: 35.495789,
    lng: 129.415649,
  }); // 위치 데이터 상태

  // useEffect(() => {
  //   // 전체 정류장 목록에서 station을 찾아 설정
  //   const foundStation = busStations.find((s) => s.id === stationId);

  //   console.log("busStations", busStations)
  //   if (foundStation) {
  //     setStation(foundStation);
  //     setStationName(foundStation.name);
  //     console.log("foundStation", foundStation)
  //     if (foundStation.location) {
  //       setLocationData({
  //         lat: foundStation.location.coordinates[1], // y 좌표 (위도)
  //         lng: foundStation.location.coordinates[0], // x 좌표 (경도)
  //       });
  //     }
  //   } else {
  //     setErrorMessage('정류장을 찾을 수 없습니다.');
  //   }
  // }, [busStations, setErrorMessage]);

  // 저장 버튼 클릭 시 처리
  const handleSave = async () => {
    try {
      // API 요청 경로를 명세서에 맞게 설정 (stationId 제외)
      await axios.put(`http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/station`, {
        name: stationName,
        location: {
          x :locationData.lng,
          y: locationData.lat
        },
      });
      alert('정류장 정보가 성공적으로 수정되었습니다.');
      navigate('/admin/bus-station');
    } catch (error) {
      console.error('정류장 정보를 수정하는 중 오류 발생:', error);
      setErrorMessage('정류장 정보를 수정하는 중 오류가 발생했습니다.');
    }
  };

  // 취소 버튼 클릭 시 처리 (이전 페이지로 돌아가기)
  const handleCancel = () => {
    navigate(-1); // 사용자가 원래 있던 페이지로 돌아가기
  };
  
  // 조건부 렌더링: locationData가 없으면 로딩 메시지를 출력
  if (!locationData) {
    return <div>위치 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className={styles.BusStationEditPage}>
      <h1>정류장 수정</h1>
      {/* 지도 표시 (카카오맵 SDK 사용) */}
      <Map
        className={styles.map}
        center={{ lat: locationData.lat, lng: locationData.lng }} // 지도의 초기 중심 좌표 설정
        level={3} // 확대 레벨
        onCenterChanged={(map) => {
          // 지도 중심 좌표가 변경될 때마다 위치 데이터를 업데이트
          const latlng = map.getCenter();
          setLocationData({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        }}
      >
        {/* 마커 표시 */}
        <MapMarker position={{ lat: locationData.lat, lng: locationData.lng }} />
      </Map>
      <input
        className={styles.input}
        type="text"
        placeholder="새로운 정류장 이름을 입력하세요"
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
      />
      {/* 저장 및 취소 버튼 */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>저장</button>
        <button onClick={handleCancel} className={styles.cancelButton}>취소</button>
      </div>
      <Footer />
    </div>
  );
}

export default BusStationEditPage;
