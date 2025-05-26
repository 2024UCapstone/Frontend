import React from "react";
import styles from "./AdminBusStationCreatePage.module.css";
import { useNavigate } from "react-router-dom";
import Footer from "components/Footer/Footer";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState } from "react";
import axios from "axios";

function AdminBusStationCreatePage() {
  const navigate = useNavigate();
  const [busStationName, setBusStationName] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const [data, setData] = useState({
    position: { lat: 35.495789, lng: 129.415649 }, // 초기 값을 설정합니다.
  });

  const registerStation = async () => {
    if (!busStationName.trim()) {
      // 이름이 비어 있는지 확인
      setErrorMessage("정류장 이름을 입력하세요.");
      return;
    }

    try {
      await axios.post(
        "http://devse.kr:12599/api/station",
        {
          name: busStationName,
          longitude: data.position.lng,
          latitude: data.position.lat,
        }
      );
      setBusStationName("");
      setErrorMessage(""); // 성공 후 오류 메시지 초기화
      navigate("/admin/bus-station");
    } catch (error) {
      console.error("등록 실패:", error);
      setErrorMessage("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 취소 버튼 클릭 시 처리 (이전 페이지로 돌아가기)
  const handleCancel = () => {
    navigate(-1); // 사용자가 원래 있던 페이지로 돌아가기
  };

  return (
    <div className={styles.AdminBusStationCreatePage}>
      <h1>정류장 등록</h1>
      <Map // 지도를 표시할 Container
        id="map"
        className={styles.map}
        center={{
          // 지도의 중심좌표
          lat: data.position.lat,
          lng: data.position.lng,
        }}
        level={4} // 지도의 확대 레벨
        onCenterChanged={(map) => {
          const level = map.getLevel();
          const latlng = map.getCenter();
          setData({
            position: {
              lat: latlng.getLat(),
              lng: latlng.getLng(),
            },
          });
        }}
      >
        <MapMarker
          position={{
            // 마커가 표시될 위치입니다
            lat: data.position.lat,
            lng: data.position.lng,
          }}
        />
      </Map>
      <input
        className={styles.input}
        type="text"
        placeholder="정류장 이름을 입력하세요"
        value={busStationName}
        onChange={(e) => setBusStationName(e.target.value)}
      />
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}{" "}
      {/* 오류 메시지 표시 */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.busStationPostButton}
          onClick={registerStation}
        >
          등록
        </button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          취소
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default AdminBusStationCreatePage;
