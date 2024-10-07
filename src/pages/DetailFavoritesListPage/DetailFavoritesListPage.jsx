import './DetailFavoritesListPage.css'
import Footer from 'components/Footer/Footer'
import { useEffect, useState } from 'react';
import MapView from 'components/MapView/MapView';

function DetailFavoritesListPage() {
    const [stations, setStations] = useState([]);
    const [busInfo, setBusInfo] = useState([]);

    // 예제 데이터를 가져오는 useEffect
    useEffect(() => {
        // 예제 데이터를 비동기로 가져오는 경우를 가정
        setTimeout(() => {
            setStations([{ name: "중부경찰서", favorite: true }]);
            setBusInfo([
                { id: 1234, distance: "180m", status: "곧 도착", seats: 10 },
                { id: 5678, distance: "680m", status: "10분 후 도착", seats: 30 },
            ]);
        });
    }, []);

    return(
        <div className="DetailFavoritesListPage">
            <MapView />
            <div className="station-list">
                <div className="station-header">
                    {
                        stations.length !== 0 ? <span>{stations[0].name}</span> : <></>
                    }
                    <span className="search-icon" onClick={() => {console.log("검색")}}>🔍</span>
                </div>
                {stations.map((station, index) => (
                    <div key={index} className="station-info">
                        {/* <div className="station-name">{station.name}</div> */}
                        <div className="bus-info">
                        {busInfo.map((bus, idx) => (
                            <div key={idx} className="bus-item">
                            <span className="bus-id">[{bus.id}]</span>
                            <span className="bus-distance">{bus.distance}</span>
                            <span className="bus-status">{bus.status}</span>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${(10 / 50) * 100}%` }}
                                ></div>
                            </div>
                            <span className="bus-seats">{bus.seats}석</span>
                            {/* <progress className="bus-seats" value="20" min="0" max="50">{bus.seats}석</progress> */}
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    )
}

export default DetailFavoritesListPage