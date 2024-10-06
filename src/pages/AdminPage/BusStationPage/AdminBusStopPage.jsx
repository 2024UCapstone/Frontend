import React from "react";
import './AdminBusStationPage.css'
import { useNavigate } from "react-router-dom";
import Footer from "components/Footer/Footer";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"
import { useState } from "react"

function AdminBusStationPage() {
  const navigate = useNavigate();
  const [busStationTitle, setBusStationTitle] = useState();
  // useKakaoLoader()
  const [data, setData] = useState()
  return (
    <div className="AdminBusStationPage">
      <Map // 지도를 표시할 Container
        id="map"
        className="map"
        center={{
          // 지도의 중심좌표
          lat: 33.450701,
          lng: 126.570667,
        }}
        level={3} // 지도의 확대 레벨
        onCenterChanged={(map) => {
          const level = map.getLevel()
          const latlng = map.getCenter()

          setData({
            level: level,
            position: {
              lat: latlng.getLat(),
              lng: latlng.getLng(),
            },
          })
        }}
      >
        <MapMarker 
          position={{
            // 마커가 표시될 위치입니다
            lat: data ? data.position.lat : 33.450701,
            lng: data ? data.position.lng : 126.570667,
          }}
        />
      </Map>
      <input className="busStationTitleInputBox" placeholder="정류장 이름을 입력해주세요" onChange={(e) => {setBusStationTitle(e.target.value)}}/>
      <div className="busStationPostButton" onClick={() => {console.log(`위도 값:${data ? data.position.lat : 33.450701}, 경도값 : ${data ? data.position.lng : 126.570667} 정류장 이름 : ${busStationTitle} 등록 완료`) ; navigate("/admin")}}>
        등록
      </div>
      <Footer />
    </div>
  );
}

export default AdminBusStationPage;