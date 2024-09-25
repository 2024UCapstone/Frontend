import React, { useEffect } from 'react';
import useStore from '../../store/UseStore';
import KakaoMap from '../../Components/KakaoMap/KakaoMap';
import MapComponent from '../../Components/MapComponent/MapComponent';
import Footer from '../../Components/Footer/Footer';
import ViewBusComponent from '../../Components/ViewBusComponent/ViewBusComponent';
import "./HomePage.css";

function HomePage() {
  // const busStops = useStore(state => state.busStops);
  // const setSelectedStop = useStore(state => state.setSelectedStop);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=27c1ced9c5970d829c5deb7182d14d75&libraries=services`;
  //   script.async = true;
  //   document.head.appendChild(script);

  //   script.onload = () => {
  //     const mapContainer = document.getElementById('map');
  //     const mapOption = {
  //       center: new window.kakao.maps.LatLng(37.5665, 126.9780),
  //       level: 3
  //     };
  //     const map = new window.kakao.maps.Map(mapContainer, mapOption);

  //     busStops.forEach(stop => {
  //       const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780); // 정류장 좌표로 수정 필요
  //       const marker = new window.kakao.maps.Marker({
  //         position: markerPosition
  //       });
  //       marker.setMap(map);
  //       window.kakao.maps.event.addListener(marker, 'click', () => {
  //         setSelectedStop(stop);
  //       });
  //     });
  //   };
  // }, [busStops, setSelectedStop]);

  return (
    <div className="HomePage">
      <KakaoMap />
      {/* <MapComponent /> */}
      <ViewBusComponent />
      <Footer />
    </div>
    // <div className={styles["homePage"]}>
    //   <div id="map" className={styles["mapContainer"]}></div>
    //   <div className={styles["busListContainer"]}>
    //     <h2>즐겨찾는 정류장</h2>
    //     <ul className={styles["busList"]}>
    //       {busStops.map(stop => (
    //         <li key={stop.id} onClick={() => setSelectedStop(stop)}>
    //           {stop.name} <button>⭐</button>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
}

export default HomePage;
