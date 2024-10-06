import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./LoadingPage.module.css"; // CSS 파일에서 애니메이션 설정
import useStore from "store/UseStore";
import useFetchBusStations from "hooks/useFetchStations";
import { BusIcon } from "assets/images";
import useFetchData from "hooks/useFetchData";

const LoadingPage = () => {
  const navigate = useNavigate();
  const setBusStops = useStore((state) => state.setBusStops);
  const busStations = useStore((state) => state.busStations)

  // 버스 정류장 데이터를 로드하는 커스텀 훅 호출
  const {data,loading,error}=useFetchData('/api/station');
  console.log(data)

  useEffect(() => {
    if (busStations.length > 0) {
      // 데이터가 다 받아지면 홈 페이지로 이동
      console.log(busStations)
      navigate('/home');
    }
  },[busStations, navigate])


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // 가상의 데이터를 생성
  //       const data = [
  //         { id: 1, name: "정류장 1" },
  //         { id: 2, name: "정류장 2" },
  //         { id: 3, name: "정류장 3" },
  //       ];
  //       // 3초 후에 데이터를 설정하고 페이지를 이동
  //       setTimeout(() => {
  //         setBusStops(data);
  //         navigate("/home");
  //       }, 3000); // 3초 대기
  //     } catch (error) {
  //       console.error("데이터 로드 중 오류 발생:", error);
  //     }
  //   };

  //   fetchData();
  // }, [navigate, setBusStops]);

  return (
    <div className={styles["loadingPage"]}>
      <div className={styles["logo"]}>
        <img className={styles["bus-icon"]} src={BusIcon} alt="Bus Logo" />
      </div>
      <div className={styles["bus-icon"]}>로딩중....</div>
    </div>
  );
};

export default LoadingPage;
