// import React, { useEffect, useState } from 'react';
// import styles from './BusStationPage.module.css';
// import useFetchData from "hooks/useFetchData"; // 커스텀 훅 불러오기
// import useStore from 'store/UseStore';
// import Footer from 'components/Footer/Footer';
// import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
// import axios from 'axios';
// // import SearchBar from "components/SearchBar"; // 검색 컴포넌트 임포트

// function BusStationPage () {
//     const navigate = useNavigate();

//     const busStations = useStore((state) => state.busStations);  // busStations 상태 가져오기
//     const setBusStations = useStore((state) => state.setBusStations)
//     const [selectedStation, setSelectedStation] = useState(null);
//     const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

//     useEffect(() => {
//         console.log(busStations);  // busStations 상태가 업데이트 될 때마다 로그로 확인
//     }, [busStations]);

//     useEffect(() => {
//         const fetchStations = async () => {
//             try {
//                 const response = await axios.get('http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/station/all'); // Proxy 설정 적용됨
//                 setBusStations(response.data);
//             } catch (error) {
//                 console.error("Error fetching bus stations:", error);
//             }
//         };
//         fetchStations()
//     }, [setBusStations])

//     // 정류장 선택 핸들러
//     const handleSelectStation = (station) => {
//         // 같은 정류장을 클릭하면 선택 해제, 다른 정류장을 클릭하면 선택
//         setSelectedStation((prev) => (prev?.id === station.id ? null : station));
//     };

//     // 검색어에 맞게 정류장 목록 필터링
//     const filteredStations = busStations.filter((station) =>
//         station.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     return (
//         <div className={styles["BusStationPage"]}>
//             <h2>정류장 목록</h2>
//             <div className={styles["searchBar"]}>
//                 <input
//                     type="text"
//                     placeholder="정류장을 검색하세요"
//                     value={searchTerm} // 입력값을 상태와 연결
//                     onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
//                 />
//                 <button className={styles["searchButton"]}>🔍</button>
//             </div>
//             {/* 정류장 목록을 출력 */}
//             <ul className={styles["stationList"]}>
//                     {filteredStations.length > 0 ? (
//                         filteredStations.map((station) => (
//                         <li
//                             key={station.id}
//                             className={`${styles["stationItem"]} ${
//                             selectedStation?.id === station.id ? styles["selected"] : ""
//                             }`}
//                             onClick={() => handleSelectStation(station)}
//                         >
//                             {station.name}
//                             {selectedStation?.id === station.id && (
//                             <div className={styles["buttonContainer"]}>
//                                 <button
//                                 className={styles["editButton"]}
//                                 onClick={() =>
//                                     navigate(`/admin-station/edit/${station.id}`)
//                                 }
//                                 >
//                                 수정
//                                 </button>
//                                 <button className={styles["deleteButton"]}>삭제</button>
//                             </div>
//                             )}
//                         </li>
//                         ))
//                     ) : (
//                         <li>검색 결과가 없습니다.</li>
//                     )}
//             </ul>
//             <button className={styles["registerButton"]} onClick={() => {navigate('create')}}>정류장 등록</button>
//             <Footer />
//         </div>
//       );
// };
// export default BusStationPage;

import React, { useEffect, useState } from 'react';
import styles from './BusStationPage.module.css';
import useFetchData from "hooks/useFetchData"; // 커스텀 훅 불러오기
import useStore from 'store/UseStore';
import Footer from 'components/Footer/Footer';
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import axios from 'axios';

function BusStationPage() {
    const navigate = useNavigate();
    const busStations = useStore((state) => state.busStations);  // busStations 상태 가져오기
    const setBusStations = useStore((state) => state.setBusStations); // Zustand로 상태 업데이트
    const [selectedStation, setSelectedStation] = useState(null); // 선택된 정류장 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    // 데이터 Fetching
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await axios.get('http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/station/all');
                setBusStations(response.data);
            } catch (error) {
                console.error("Error fetching bus stations:", error);
            }
        };
        fetchStations();
    }, [setBusStations]);

    // 정류장 선택 핸들러
    const handleSelectStation = (station) => {
        // 같은 정류장을 클릭하면 선택 해제, 다른 정류장을 클릭하면 선택
        setSelectedStation((prev) => (prev?.id === station.id ? null : station));
    };

    // 검색어에 맞게 정류장 목록 필터링
    const filteredStations = busStations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles["BusStationPage"]}>
            <h2>정류장 목록</h2>
            <div className={styles["searchBar"]}>
                <input
                    type="text"
                    placeholder="정류장을 검색하세요"
                    value={searchTerm} // 입력값을 상태와 연결
                    onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
                />
                <button className={styles["searchButton"]}>🔍</button>
            </div>

            <ul className={styles["stationList"]}>
                {filteredStations.length > 0 ? (
                    filteredStations.map((station) => (
                        <li
                            key={station.id}
                            className={`${styles["stationItem"]} ${
                                selectedStation?.id === station.id ? styles["selected"] : ""
                            }`}
                            onClick={() => handleSelectStation(station)}
                        >
                            {station.name}
                            {selectedStation?.id === station.id && (
                                <div className={styles["buttonContainer"]}>
                                    <button
                                        className={styles["editButton"]}
                                        onClick={() =>
                                            navigate(`/admin-station/edit/${station.id}`)
                                        }
                                    >
                                        수정
                                    </button>
                                    <button className={styles["deleteButton"]}>삭제</button>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <li className={styles["noStations"]}>등록된 정류장이 없습니다.</li>
                )}
            </ul>

            <button
                className={styles["registerButton"]}
                onClick={() => navigate('/admin/bus-station/create')}
            >
                정류장 등록
            </button>

            <Footer />
        </div>
    );
}

export default BusStationPage;