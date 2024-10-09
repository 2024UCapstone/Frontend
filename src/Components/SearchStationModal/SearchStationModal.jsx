// import React from 'react';
// // import './SerchModal.css';

// const SerchModal = ({ isOpen, toggleModal, busStops, toggleFavorite }) => {
//   if (!isOpen) return null; // 모달이 열리지 않았을 때 아무것도 렌더링하지 않음

//   return (
//     <div className="SerchModal" onClick={toggleModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h3>정류장 검색</h3>
//         <input type="text" placeholder="검색할 정류장 이름 입력" />

//         <ul className="bus-stop-list">
//           {busStops.map((stop) => (
//             <li key={stop.name} className="bus-stop-item">
//               {stop.name}
//               <button
//                 className={`favorite-button ${stop.isFavorite ? 'active' : ''}`}
//                 onClick={() => toggleFavorite(stop.name)}
//               >
//                 {stop.isFavorite ? '★' : '☆'}
//               </button>
//             </li>
//           ))}
//         </ul>

//         <button onClick={toggleModal} className="close-modal">닫기</button>
//       </div>
//     </div>
//   );
// };

// export default SerchModal;

// import React from "react";
// import "./SerchModal.css";

// function SerchModal({ isOpen, toggleModal, stations, toggleFavorite }) {
//   if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="modal-close-btn" onClick={toggleModal}>
//           닫기
//         </button>
//         <h3>정류장 검색</h3>
//         <ul className="station-list">
//           {stations.map((station, index) => (
//             <li key={index} className="station-item">
//               {station.name}
//               <button
//                 className={`favorite-button ${station.favorite ? "active" : ""}`}
//                 onClick={() => toggleFavorite(station.name)}
//               >
//                 {station.favorite ? "★" : "☆"}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default SerchModal;


// import React, { useState } from 'react';
// import './SerchModal.css';

// const SerchModal = ({ isOpen, toggleModal, busStops, toggleFavorite }) => {
//   const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리

//   // 검색어에 따라 정류장 목록 필터링
//   const filteredBusStops = busStops.filter((stop) =>
//     stop.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (!isOpen) return null; // 모달이 열리지 않았을 때 아무것도 렌더링하지 않음

//   return (
//     <div className="SerchModal" onClick={toggleModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h3>정류장 검색</h3>

//         {/* 검색어 입력 필드 */}
//         <input
//           type="text"
//           placeholder="검색할 정류장 이름 입력"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />

//         {/* 검색된 정류장 목록 */}
//         <ul className="bus-stop-list">
//           {filteredBusStops.length > 0 ? (
//             filteredBusStops.map((stop) => (
//               <li key={stop.name} className="bus-stop-item">
//                 {stop.name}
//                 <button
//                   className={`favorite-button ${stop.isFavorite ? 'active' : ''}`}
//                   onClick={() => toggleFavorite(stop.name)}
//                 >
//                   {stop.isFavorite ? '★' : '☆'}
//                 </button>
//               </li>
//             ))
//           ) : (
//             <li className="bus-stop-item">검색 결과가 없습니다.</li>
//           )}
//         </ul>

//         <button onClick={toggleModal} className="close-modal">닫기</button>
//       </div>
//     </div>
//   );
// };

// export default SerchModal;

// import React, { useState } from 'react';
// import './SerchModal.css';

// const SerchModal = ({ isOpen, toggleModal, busStops = [], toggleFavorite }) => {
//   // busStops가 undefined일 때 빈 배열로 처리되도록 기본값 설정
//   const [searchTerm, setSearchTerm] = useState('');

//   if (!isOpen) return null; // 모달이 열리지 않았을 때 아무것도 렌더링하지 않음

//   // 검색어에 따라 필터링된 정류장 목록
//   const filteredBusStops = busStops.filter((stop) =>
//     stop.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="SerchModal" onClick={toggleModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h3>정류장 검색</h3>
//         <input
//           type="text"
//           placeholder="검색할 정류장 이름 입력"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <ul className="bus-stop-list">
//           {filteredBusStops.map((stop) => (
//             <li key={stop.name} className="bus-stop-item">
//               {stop.name}
//               <button
//                 className={`favorite-button ${stop.isFavorite ? 'active' : ''}`}
//                 onClick={() => toggleFavorite(stop.name)}
//               >
//                 {stop.isFavorite ? '★' : '☆'}
//               </button>
//             </li>
//           ))}
//         </ul>

//         <button onClick={toggleModal} className="close-modal">
//           닫기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SerchModal;


import React, { useState } from 'react';
import styles from './SearchStationModal.module.css';

const SearchStationModal = ({ isOpen, toggleModal, stations, favoriteStations, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className={styles.SearchModal} onClick={toggleModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>정류장 검색</h3>
        <input
          type="text"
          placeholder="검색할 정류장 이름 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className={styles.busStopList}>
          {stations && stations?.map((station) => (
            <li key={station.name} className={styles.busStopItem}>
              {station.name}
              <button
                className={`favoriteButton ${favoriteStations && favoriteStations?.find((item)=> item.id === station.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(station.id)}
              >
                {favoriteStations && favoriteStations?.find((item)=> item.id === station.id) ? '★' : '☆'}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={toggleModal} className={styles.closeModal}>닫기</button>
      </div>
    </div>
  );
};

export default SearchStationModal;
