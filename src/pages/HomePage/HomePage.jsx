import React, { useEffect, useState } from "react";
import Footer from "components/Footer/Footer";
import styles from "./HomePage.module.css";
import SearchBar from "components/SearchBar/SearchBar";
import MapView from "../../components/MapView/MapView";
import { useLocation, useNavigate } from "react-router";
import StationPanel from "../../components/StationPanel/StationPanel";
import SearchStationModal from "../../components/SearchStationModal/SearchStationModal";
import useFetchData from "hooks/useFetchData";
import usePostData from "hooks/usePostData";
import useDeleteData from "hooks/useDeleteData";
import LoadingPage from "pages/LoadingPage/LoadingPage";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchStationModalOpen, setIsSearchStationModalOpen] = useState(false);
  const { data: myStationData, load: myStationLoad, error: myStationError, fetchData: myStationFetchData } = useFetchData("http://devse.gonetis.com:12599/api/user/my-station");
  const { postData: myStationPostData } = usePostData("http://devse.gonetis.com:12599/api/user/my-station");
  const { deleteData: stationDel } = useDeleteData("http://devse.gonetis.com:12599/api/user/my-station");
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate(location.pathname, { replace: true });
      navigate('/home');
    }
    // 여기에 stations와 favoriteStations를 가져오는 로직 추가
  }, [location, navigate]);

  useEffect(()=>{
    myStationFetchData();
  }, [])

  const toggleFavorite = async (id) => {
    try {
      if (myStationData && myStationData.data?.find((item) => item.id === id)) {
        await stationDel(id);
        alert("정류장이 즐겨찾기에서 제거되었습니다.");
      } else {
        await myStationPostData({ stationId: id });
        alert("정류장이 즐겨찾기에 추가었습니다.");
      }
      // 즐겨찾기 목록 갱신
      myStationFetchData();
    } catch (error) {
      alert("작업 중 오류가 발생했습니다.");
    }
  };

  if (myStationLoad) return <LoadingPage/>;
  if (myStationError) return <div>에러가 발생했습니다.</div>;

  return (
    <div className={styles.body}>
      <div className={styles.searchBar}>
        <SearchBar         
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}/>
      </div>
      <div className={styles.mapView}><MapView /></div>
      <StationPanel
        openSearchStationModal={() => setIsSearchStationModalOpen(true)}
        favoriteStations={myStationData.data}
        toggleFavorite={toggleFavorite}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      <SearchStationModal
        isOpen={isSearchStationModalOpen}
        toggleModal={() => setIsSearchStationModalOpen(false)}
        favoriteStations={myStationData.data}
        toggleFavorite={toggleFavorite}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      <Footer />
    </div>
  );
}

export default HomePage;