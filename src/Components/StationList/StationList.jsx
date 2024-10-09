import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import SearchStationModal from "components/SearchStationModal/SearchStationModal";
import styles from "./StationList.module.css";
import DraggablePanel from "../DraggablePanel/DraggablePanel";
import useStore from "store/UseStore";
import useFetchData from "hooks/useFetchData";
import usePostData from "hooks/usePostData";
import useDeleteData from "hooks/useDeleteData";
import LoadingPage from "pages/LoadingPage/LoadingPage";

export default function StationList() {
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

  const toggleModal = () => setSearchModalOpen(!searchModalOpen);

  const contentHeight = tabHeight - 12;

  if (stationLoad || myStationLoad) return <LoadingPage/>;
  if (stationError || myStationError) return <div>에러가 발생했습니다.</div>;

  return (
    <DraggablePanel>
      <div className={styles.stationListBody} style={{ height: `${contentHeight}px` }}>
        <div className={styles.stationListContainer}>
          <div className={styles.stationListHeader}>
            <span className={styles.stationListTitle}>정류장</span>
            <span className={styles.searchIcon} onClick={toggleModal}>
              🔍
            </span>
          </div>
          <div className={styles.stationListItems}>
            {myStationData && myStationData.data?.length === 0 ? (
              <div className={styles.stationListItem}>즐겨찾는 정류장이 없습니다. 정류장을 등록해 주세요.</div>
            ) : (
              myStationData && myStationData.data?.map((station) => (
                <div
                  key={station.id}
                  className={`${styles.stationListItem} ${selectedStation?.id === station.id ? styles.selected : ""}`}
                  onClick={() => {
                    setSelectedStation(station);
                    navigate("/detailfavoriteslist");
                  }}
                >
                  {station.name}
                  <span
                    className={styles.star}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station.id);
                    }}
                  >
                    ★
                  </span>
                </div>
              ))
            )}
          </div>
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