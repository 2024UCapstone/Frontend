import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import SearchStationModal from "components/SearchStationModal/SearchStationModal";
import styles from "./StationPanel.module.css";
import useStore from "store/UseStore";
import useFetchData from "hooks/useFetchData";
import usePostData from "hooks/usePostData";
import useDeleteData from "hooks/useDeleteData";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import StationDetail from "pages/StationDetail/StationDetail";
import StationList from "components/StationList/StationList";
import DraggablePanel from "components/DraggablePanel/DraggablePanel";

export default function StationPanel() {
  const { tabHeight } = useStore();
  const { data: stationData, load: stationLoad, error: stationError, fetchData: stationFetchData } = useFetchData("http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/station");
  const { data: myStationData, load: myStationLoad, error: myStationError, fetchData: myStationFetchData } = useFetchData("http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/user/my-station");
  const { postData: myStationPostData } = usePostData("http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/user/my-station");
  const { deleteData: stationDel } = useDeleteData("http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/user/my-station");

  const [selectedStation, setSelectedStation] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    stationFetchData();
    myStationFetchData();
    console.log(stationData);
    console.log(myStationData);
  }, []);

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

  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };

  const toggleModal = () => setSearchModalOpen(!searchModalOpen);

  const contentHeight = tabHeight - 12;

  if (stationLoad || myStationLoad) return <LoadingPage/>;
  if (stationError || myStationError) return <div>에러가 발생했습니다.</div>;

  return (
    <DraggablePanel>
      <div className={styles.stationListBody} style={{ height: `${contentHeight}px` }}>
        <div className={styles.stationListContainer}>
          <div className={styles.stationListHeader}>
            <span className={styles.stationListTitle}>{selectedStation ? selectedStation.name : '정류장'}</span>
            <span className={styles.searchIcon} onClick={toggleModal}>
              🔍
            </span>
          </div>
          {selectedStation ? (
              <StationDetail 
                station={selectedStation} 
                onBack={() => setSelectedStation(null)}
              />
            ) : (
              <StationList 
              favoriteStations={myStationData.data}
              selectedStation={selectedStation} 
              onStationSelect={handleStationSelect}
              toggleFavorite={toggleFavorite}
              />
            )
          }
        </div>
        <SearchStationModal
          isOpen={searchModalOpen}
          toggleModal={toggleModal}
          stations={stationData.data}
          favoriteStations={myStationData.data}
          toggleFavorite={toggleFavorite}
        />
      </div>
    </DraggablePanel>
  );
}