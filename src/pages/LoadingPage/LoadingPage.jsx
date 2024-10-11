import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./LoadingPage.module.css";
import useStore from "store/UseStore";
import { BusIcon } from "assets/images";
import axios from "axios";
import useFetchData from "hooks/useFetchData";

const LoadingPage = () => {
  // const navigate = useNavigate();

  // // Zustand에서 상태 관리
  // const busStations = useStore((state) => state.busStations);  // busStations 상태 가져오기
  // const setBusStations = useStore((state) => state.setBusStations);  // 버스 정류장 상태 설정 함수
  // const setFavoriteStops = useStore((state) => state.setFavoriteStops);  // 즐겨찾는 정류장 상태 설정 함수
  // const setIsLoading = useStore((state) => state.setIsLoading);  // 로딩 상태 설정 함수
  // const setErrorMessage = useStore((state) => state.setErrorMessage);  // 에러 메시지 설정 함수

  // // 버스 정류장 데이터를 로드하는 커스텀 훅 호출
  // const { data, loading, message, fetchData } = useFetchData('http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/station/all');

  // // 컴포넌트가 마운트될 때 데이터 요청
  // useEffect(() => {
  //   fetchData();  // 데이터를 불러옵니다.
  // }, [fetchData]);

  // // 데이터를 다 불러온 후 zustand로 상태 저장 후 홈 페이지로 이동
  // useEffect(() => {
  //   if (!loading && data) {  // 로딩이 완료되었고, 데이터가 존재하면
  //     setBusStations(data);  // 받아온 데이터를 zustand 상태에 저장
  //     console.log('busStations:', data);  // 데이터가 받아진 상태를 콘솔로 확인
  //     setIsLoading(false);  // 로딩 완료
  //     navigate('/home');  // 홈 페이지로 이동
  //   } else if (message) {  // 에러 발생 시 에러 메시지 저장
  //     setErrorMessage(message);
  //     setIsLoading(false);  // 로딩 완료로 설정
  //   }
  // }, [loading, data, message, navigate, setBusStations, setIsLoading, setErrorMessage]);

  // // 상태를 실시간으로 콘솔에 출력 (디버깅 용도)
  // useEffect(() => {
  //   console.log('Current busStations state:', busStations);  // busStations 상태 실시간 확인
  // }, [busStations]);

  // useEffect(() => {
  //   if (data) {
  //     console.log("Bus stations data:", data);  // 데이터를 제대로 불러왔는지 확인
  //     setBusStations(data);  // 상태 설정
  //   }
  // }, [data, setBusStations]);
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
