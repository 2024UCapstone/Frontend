import './ViewBusComponent.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function ViewBusComponent({ openModal }) {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [busInfo, setBusInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 예제 데이터를 비동기로 가져오는 경우를 가정
    setTimeout(() => {
      setStations([
        { name: '중부경찰서', favorite: true, id: 1 },
        { name: '동부캠퍼스 로터리', favorite: true, id: 2 },
        { name: '중부경찰서', favorite: false, id: 3 },
        { name: '동부캠퍼스 로터리', favorite: false, id: 4 },
        { name: '추가 정류장', favorite: false, id: 5 },
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedStation) {
      // 예제 데이터를 비동기로 가져오는 경우를 가정
      setTimeout(() => {
        setBusInfo([
          { id: 1234, distance: '180m', status: '곧 도착', seats: 10, totalSeats: 50 },
          { id: 5678, distance: '680m', status: '10분 후 도착', seats: 30, totalSeats: 50 },
        ]);
      }, 500);
    } else {
      setBusInfo([]);
    }
  }, [selectedStation]);

  const emptySlots = Array.from({ length: Math.max(4 - stations.length, 0) });

  return (
    <div className='Viewbuscomponent'>
      <div className="station-list">
        <div className="station-header">
          <span>정류장</span>
          <span className="search-icon" onClick={openModal}>🔍</span>
        </div>
        <div className="station-items">
          {stations.length === 0 ? (
            <div className="station-item">
              즐겨찾기된 정류장이 없습니다
            </div>
          ) : (
            stations.map((station, index) => (
              <div
                key={index}
                className={`station-item ${selectedStation && selectedStation.id === station.id ? 'selected' : ''}`}
                onClick={() => {setSelectedStation(station); navigate('/detailfavoriteslist')}}
              >
                {station.name}
                <span className="star">{station.favorite ? '★' : '☆'}</span>
              </div>
            ))
          )}
          {emptySlots.slice(stations.length === 0 ? 1 : 0).map((_, index) => (
            <div key={index} className="station-item empty">
              {/* 빈 슬롯 */}
            </div>
          ))}
        </div>
        {selectedStation && (
          <div className="bus-info">
            {busInfo.map((bus, idx) => (
              <div key={idx} className="bus-item">
                <span className="bus-id">[{bus.id}]</span>
                <span className="bus-distance">{bus.distance}</span>
                <span className="bus-status">{bus.status}</span>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${(bus.seats / bus.totalSeats) * 100}%` }}
                  ></div>
                </div>
                <span className="bus-seats">{bus.seats}석</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewBusComponent;
