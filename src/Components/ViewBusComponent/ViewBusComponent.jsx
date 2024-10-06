// import SerchModal from "components/SerchModal/SerchModal";
// import "./ViewBusComponent.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";

// function ViewBusComponent({ openModal }) {
//   const [stations, setStations] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [busInfo, setBusInfo] = useState([]);
//   const [serchmodalOpen, setSerchModalOpen] = useState(false); // 모달 상태 관리
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 예제 데이터를 비동기로 가져오는 경우를 가정
//     setTimeout(() => {
//       setStations([
        // { name: "중부경찰서", favorite: true, id: 1 },
        // { name: "동부캠퍼스 로터리", favorite: true, id: 2 },
        // { name: "성남동", favorite: false, id: 3 },
        // { name: "태화로터리", favorite: false, id: 4 },
        // { name: "우정동", favorite: false, id: 5 },
//       ]);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (selectedStation) {
//       // 예제 데이터를 비동기로 가져오는 경우를 가정
//       setTimeout(() => {
//         setBusInfo([
//           {
//             id: 1234,
//             distance: "180m",
//             status: "곧 도착",
//             seats: 10,
//             totalSeats: 50,
//           },
//           {
//             id: 5678,
//             distance: "680m",
//             status: "10분 후 도착",
//             seats: 30,
//             totalSeats: 50,
//           },
//         ]);
//       }, 500);
//     } else {
//       setBusInfo([]);
//     }
//   }, [selectedStation]);

//   // 모달 열기 및 닫기
//   const toggleModal = () => {
//     setSerchModalOpen(!serchmodalOpen);
//   };

//   // 즐겨찾기 추가/삭제
//   const toggleFavorite = (stopName) => {
//     const updatedStops = stations.map((stop) =>
//       stop.name === stopName ? { ...stop, favorite: !stop.favorite } : stop
//     );
//     setStations(updatedStops);
//   };

//   // 즐겨찾기 정류장 먼저 정렬
//   const sortedBusStops = [...stations].sort((a, b) => b.favorite - a.favorite);
//   const emptySlots = Array.from({ length: Math.max(4 - stations.length, 0) });

//   return (
//     <div className="Viewbuscomponent">
//       <div className="station-list">
//         <div className="station-header">
//           <span>정류장</span>
//           <span className="search-icon" onClick={toggleModal}>
//             🔍
//           </span>
//         </div>
//         <div className="station-items">
//           {stations.length === 0 ? (
//             <div className="station-item">즐겨찾기된 정류장이 없습니다</div>
//           ) : (
//             stations.map((station, index) => (
//               <div
//                 key={index}
//                 className={`station-item ${
//                   selectedStation && selectedStation.id === station.id
//                     ? "selected"
//                     : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedStation(station);
//                   navigate("/detailfavoriteslist");
//                 }}
//               >
//                 {station.name}
//                 <span className="star">{station.favorite ? "★" : "☆"}</span>
//               </div>
//             ))
//           )}
//           {emptySlots.slice(stations.length === 0 ? 1 : 0).map((_, index) => (
//             <div key={index} className="station-item empty">
//               {/* 빈 슬롯 */}
//             </div>
//           ))}
//         </div>
//         {selectedStation && (
//           <div className="bus-info">
//             {busInfo.map((bus, idx) => (
//               <div key={idx} className="bus-item">
//                 <span className="bus-id">[{bus.id}]</span>
//                 <span className="bus-distance">{bus.distance}</span>
//                 <span className="bus-status">{bus.status}</span>
//                 <div className="progress-bar">
//                   <div
//                     className="progress"
//                     style={{ width: `${(bus.seats / bus.totalSeats) * 100}%` }}
//                   ></div>
//                 </div>
//                 <span className="bus-seats">{bus.seats}석</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* 모달 컴포넌트 사용 */}
//       <SerchModal
//         isOpen={serchmodalOpen}
//         toggleModal={toggleModal}
//         stations={stations} // 검색 가능한 정류장 목록 전달
//         toggleFavorite={toggleFavorite} // 즐겨찾기 추가/삭제 함수 전달
//       />
//     </div>
//   );
// }

// export default ViewBusComponent;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import SerchModal from "components/SerchModal/SerchModal";
// import "./ViewBusComponent.css";

// function ViewBusComponent() {
//   const [stations, setStations] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [busInfo, setBusInfo] = useState([]);
//   const [serchmodalOpen, setSerchModalOpen] = useState(false); // 모달 상태 관리
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 예제 데이터를 비동기로 가져오는 경우를 가정
//     setTimeout(() => {
//       setStations([
//         { name: "중부경찰서", favorite: true, id: 1 },
//         { name: "동부캠퍼스 로터리", favorite: true, id: 2 },
//         { name: "성남동", favorite: false, id: 3 },
//         { name: "태화로터리", favorite: false, id: 4 },
//         { name: "우정동", favorite: false, id: 5 },
//       ]);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (selectedStation) {
//       // 예제 데이터를 비동기로 가져오는 경우를 가정
//       setTimeout(() => {
//         setBusInfo([
//           {
//             id: 1234,
//             distance: "180m",
//             status: "곧 도착",
//             seats: 10,
//             totalSeats: 50,
//           },
//           {
//             id: 5678,
//             distance: "680m",
//             status: "10분 후 도착",
//             seats: 30,
//             totalSeats: 50,
//           },
//         ]);
//       }, 500);
//     } else {
//       setBusInfo([]);
//     }
//   }, [selectedStation]);

//   // 모달 열기 및 닫기
//   const toggleModal = () => {
//     setSerchModalOpen(!serchmodalOpen);
//   };

//   // 즐겨찾기 추가/삭제
//   const toggleFavorite = (stopName) => {
//     const updatedStops = stations.map((stop) =>
//       stop.name === stopName ? { ...stop, favorite: !stop.favorite } : stop
//     );
//     setStations(updatedStops);
//   };

//   const emptySlots = Array.from({ length: Math.max(4 - stations.length, 0) });

//   return (
//     <div className="Viewbuscomponent">
//       <div className="station-list">
//         <div className="station-header">
//           <span>정류장</span>
//           <span className="search-icon" onClick={toggleModal}>
//             🔍
//           </span>
//         </div>
//         <div className="station-items">
//           {stations.length === 0 ? (
//             <div className="station-item">즐겨찾기된 정류장이 없습니다</div>
//           ) : (
//             stations.map((station, index) => (
//               <div
//                 key={index}
//                 className={`station-item ${
//                   selectedStation && selectedStation.id === station.id
//                     ? "selected"
//                     : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedStation(station);
//                   navigate("/detailfavoriteslist");
//                 }}
//               >
//                 {station.name}
//                 <span className="star">{station.favorite ? "★" : "☆"}</span>
//               </div>
//             ))
//           )}
//           {emptySlots.slice(stations.length === 0 ? 1 : 0).map((_, index) => (
//             <div key={index} className="station-item empty">
//               {/* 빈 슬롯 */}
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* 모달 컴포넌트 사용 */}
//       <SerchModal
//         isOpen={serchmodalOpen}
//         toggleModal={toggleModal}
//         stations={stations} // 검색 가능한 정류장 목록 전달
//         toggleFavorite={toggleFavorite} // 즐겨찾기 추가/삭제 함수 전달
//       />
//     </div>
//   );
// }

// export default ViewBusComponent;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import SerchModal from "components/SerchModal/SerchModal";
// import "./ViewBusComponent.css";

// function ViewBusComponent() {
//   const [stations, setStations] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [busInfo, setBusInfo] = useState([]);
//   const [serchmodalOpen, setSerchModalOpen] = useState(false); // 모달 상태 관리
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 예제 데이터를 비동기로 가져오는 경우를 가정
//     setTimeout(() => {
//       setStations([
//         { name: "중부경찰서", favorite: true, id: 1 },
//         { name: "동부캠퍼스 로터리", favorite: true, id: 2 },
//         { name: "성남동", favorite: false, id: 3 },
//         { name: "태화로터리", favorite: false, id: 4 },
//         { name: "우정동", favorite: false, id: 5 },
//       ]);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (selectedStation) {
//       // 예제 데이터를 비동기로 가져오는 경우를 가정
//       setTimeout(() => {
//         setBusInfo([
//           {
//             id: 1234,
//             distance: "180m",
//             status: "곧 도착",
//             seats: 10,
//             totalSeats: 50,
//           },
//           {
//             id: 5678,
//             distance: "680m",
//             status: "10분 후 도착",
//             seats: 30,
//             totalSeats: 50,
//           },
//         ]);
//       }, 500);
//     } else {
//       setBusInfo([]);
//     }
//   }, [selectedStation]);

//   // 모달 열기 및 닫기
//   const toggleModal = () => {
//     setSerchModalOpen(!serchmodalOpen);
//   };

//   // 즐겨찾기 추가/삭제
//   const toggleFavorite = (stopName) => {
//     const updatedStops = stations.map((stop) =>
//       stop.name === stopName ? { ...stop, favorite: !stop.favorite } : stop
//     );
//     setStations(updatedStops);
//   };

//   const emptySlots = Array.from({ length: Math.max(4 - stations.length, 0) });

//   return (
//     <div className="Viewbuscomponent">
//       <div className="station-list">
//         <div className="station-header">
//           <span>정류장</span>
//           <span className="search-icon" onClick={toggleModal}>
//             🔍
//           </span>
//         </div>
//         <div className="station-items">
//           {stations.length === 0 ? (
//             <div className="station-item">즐겨찾기된 정류장이 없습니다</div>
//           ) : (
//             stations.map((station, index) => (
//               <div
//                 key={index}
//                 className={`station-item ${
//                   selectedStation && selectedStation.id === station.id
//                     ? "selected"
//                     : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedStation(station);
//                   navigate("/detailfavoriteslist");
//                 }}
//               >
//                 {station.name}
//                 <span className="star">{station.favorite ? "★" : "☆"}</span>
//               </div>
//             ))
//           )}
//           {emptySlots.slice(stations.length === 0 ? 1 : 0).map((_, index) => (
//             <div key={index} className="station-item empty">
//               {/* 빈 슬롯 */}
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* 모달 컴포넌트 사용 */}
//       <SerchModal
//         isOpen={serchmodalOpen}
//         toggleModal={toggleModal}
//         stations={stations} // 검색 가능한 정류장 목록 전달
//         toggleFavorite={toggleFavorite} // 즐겨찾기 추가/삭제 함수 전달
//       />
//     </div>
//   );
// }

// export default ViewBusComponent;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import SerchModal from "components/SerchModal/SerchModal";
// import "./ViewBusComponent.css";

// function ViewBusComponent() {
//   const [stations, setStations] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [busInfo, setBusInfo] = useState([]);
//   const [serchmodalOpen, setSerchModalOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setTimeout(() => {
//       setStations([
//         { name: "중부경찰서", favorite: true, id: 1 },
//         { name: "동부캠퍼스 로터리", favorite: true, id: 2 },
//         { name: "성남동", favorite: false, id: 3 },
//         { name: "태화로터리", favorite: false, id: 4 },
//         { name: "우정동", favorite: false, id: 5 },
//       ]);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (selectedStation) {
//       setTimeout(() => {
//         setBusInfo([
//           { id: 1234, distance: "180m", status: "곧 도착", seats: 10, totalSeats: 50 },
//           { id: 5678, distance: "680m", status: "10분 후 도착", seats: 30, totalSeats: 50 },
//         ]);
//       }, 500);
//     } else {
//       setBusInfo([]);
//     }
//   }, [selectedStation]);

//   const toggleModal = () => setSerchModalOpen(!serchmodalOpen);

//   // 즐겨찾기 추가/삭제 함수
//   const toggleFavorite = (stopName) => {
//     const updatedStops = stations.map((stop) =>
//       stop.name === stopName ? { ...stop, favorite: !stop.favorite } : stop
//     );
//     setStations(updatedStops);
//   };

//   const emptySlots = Array.from({ length: Math.max(4 - stations.length, 0) });

//   return (
//     <div className="Viewbuscomponent">
//       <div className="station-list">
//         <div className="station-header">
//           <span>정류장</span>
//           <span className="search-icon" onClick={toggleModal}>
//             🔍
//           </span>
//         </div>
//         <div className="station-items">
//           {stations.length === 0 ? (
//             <div className="station-item">즐겨찾기된 정류장이 없습니다</div>
//           ) : (
//             stations.map((station, index) => (
//               <div
//                 key={index}
//                 className={`station-item ${selectedStation?.id === station.id ? "selected" : ""}`}
//                 onClick={() => {
//                   setSelectedStation(station);
//                   navigate("/detailfavoriteslist");
//                 }}
//               >
//                 {station.name}
//                 {/* 즐겨찾기 토글을 위한 클릭 핸들러 추가 */}
//                 <button
//                   className="star"
//                   onClick={(e) => {
//                     e.stopPropagation(); // 부모 요소 클릭 이벤트 전파 방지
//                     toggleFavorite(station.name);
//                   }}
//                 >
//                   {station.favorite ? "★" : "☆"}
//                 </button>
//               </div>
//             ))
//           )}
//           {emptySlots.slice(stations.length === 0 ? 1 : 0).map((_, index) => (
//             <div key={index} className="station-item empty"></div>
//           ))}
//         </div>
//       </div>
//       <SerchModal
//         isOpen={serchmodalOpen}
//         toggleModal={toggleModal}
//         stations={stations}
//         toggleFavorite={toggleFavorite}
//       />
//     </div>
//   );
// }

// export default ViewBusComponent;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SerchModal from "components/SearchStationModal/SearchStationModal";
import "./ViewBusComponent.css";

function ViewBusComponent() {
  const [stations, setStations] = useState([
    { name: "중부경찰서", favorite: true, id: 1 },
    { name: "동부캠퍼스 로터리", favorite: true, id: 2 },
    { name: "성남동", favorite: false, id: 3 },
    { name: "태화로터리", favorite: false, id: 4 },
    { name: "우정동", favorite: false, id: 5 },
  ]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [serchmodalOpen, setSerchModalOpen] = useState(false);
  const navigate = useNavigate();

  // 즐겨찾기 추가/삭제 함수
  const toggleFavorite = (stopName) => {
    const updatedStops = stations.map((stop) =>
      stop.name === stopName ? { ...stop, favorite: !stop.favorite } : stop
    );
    setStations(updatedStops);
  };

  const favoriteStations = stations.filter((station) => station.favorite); // 즐겨찾기된 정류장만 필터링
  const emptySlots = Array.from({ length: Math.max(4 - favoriteStations.length, 0) });

  const toggleModal = () => setSerchModalOpen(!serchmodalOpen);

  return (
    <div className="Viewbuscomponent">
      <div className="station-list">
        <div className="station-header">
          <span>정류장</span>
          <span className="search-icon" onClick={toggleModal}>
            🔍
          </span>
        </div>
        <div className="station-items">
          {/* 즐겨찾는 정류장이 없는 경우 안내문구 출력 */}
          {favoriteStations.length === 0 ? (
            <div className="station-item">즐겨찾는 정류장이 없습니다. 정류장을 등록해 주세요.</div>
          ) : (
            favoriteStations.map((station, index) => (
              <div
                key={index}
                className={`station-item ${selectedStation?.id === station.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedStation(station);
                  navigate("/detailfavoriteslist");
                }}
              >
                {station.name}
                <span
                  className="star"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 요소 클릭 이벤트 전파 방지
                    toggleFavorite(station.name);
                  }}
                >
                  {station.favorite ? "★" : "☆"}
                </span>
              </div>
            ))
          )}
          {emptySlots.slice(favoriteStations.length === 0 ? 1 : 0).map((_, index) => (
            <div key={index} className="station-item empty"></div>
          ))}
        </div>
      </div>
      <SerchModal
        isOpen={serchmodalOpen}
        toggleModal={toggleModal}
        stations={stations}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default ViewBusComponent;
