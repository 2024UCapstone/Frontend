import { useEffect } from 'react';
import axios from 'axios';
import useStore from 'store/UseStore';

const useFetchBusStations = () => {
  const setBusStations = useStore((state) => state.setbusStations);
  const setFavoriteStops = useStore((state) => state.setFavoriteStops);
  
  const fetchBusStations = async () => {
    try {
      const response = await axios.get('/api/station'); // 프록시 설정으로 인해 자동으로 요청됨
      setBusStations(response.data); // 버스 정류장 목록 업데이트
      const favoriteStops = response.data.filter(station => station.favorite); // 즐겨찾기 필터링
      setFavoriteStops(favoriteStops); // 즐겨찾기 정류장 업데이트
      console.log(response)
    } catch (error) {
      console.error("정류장 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchBusStations();
  }, []);
};

export default useFetchBusStations;
