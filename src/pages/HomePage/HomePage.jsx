import React from 'react';
import '../../App.css';

function HomePage() {
//   const { busStops, isSearchModalOpen, setSearchModalOpen } = useStore();

//   const handleSearchClick = () => {
//     setSearchModalOpen(true);
//   };

  return (
    <div className="HomePage">
      <div className="content">
        <div className="map">
          {/* 지도 컴포넌트 삽입 */}
        </div>
        <div className="stop-container">
          <input type="text" placeholder="정류장을 검색하세요." />
          <button type="button" onClick={() => {console.log("검색")}}>검색</button>
          <div className="favorites">
            {/* {busStops.length === 0 ? '즐겨찾기 된 정류장이 없습니다...' : busStops.map(stop => (
              <div key={stop.id}>{stop.name}</div>
            ))} */}
          </div>
        </div>
      </div>
      {/* {isSearchModalOpen && <StopSearchModal />}
      <HelpIcon /> */}
      <div className="footer">
        {/* 네비게이션 바 */}
        <button>내 정보</button>
        <button>홈</button>
        <button>버스 노선</button>
        <button>즐겨찾기</button>
      </div>
    </div>
  );
}

export default HomePage;