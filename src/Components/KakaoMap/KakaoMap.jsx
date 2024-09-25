import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import "./KakaoMap.css";
import { useEffect, useState } from "react";
import BusIcon from "../../Assets/Image/free-icon-bus-1168001.png"


function KakaoMap(){
    // 지도의 중심좌표
    const [center, setCenter] = useState({
        lat: 35.495789,
        lng: 129.415649,
    });
    
    // 현재 위치
    const [position, setPosition] = useState({
        lat: 33.450701,
        lng: 126.570667,
    });

    const busStopList = [
        {
          title: "2대학관",
          latlng: { lat: 35.495299450684456, lng: 129.4172414821444 },
        },
        {
          title: "1대학관",
          latlng: { lat: 35.49491121578819, lng: 129.4163814699469 },
        },
        {
          title: "3대학관",
          latlng: { lat: 35.49574107312693, lng: 129.41678645417534 },
        },
        {
          title: "행정본관",
          latlng: { lat: 35.49547208702291, lng: 129.416045699906 },
        },
      ]

    // 지도가 처음 렌더링되면 중심좌표를 현위치로 설정하고 위치 변화 감지
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
        navigator.geolocation.watchPosition((pos) => {
            setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
    }, []);

    return (
        <Map // 지도를 표시할 Container
            className="map"
            center={{
                // 지도의 중심좌표
                lat: 35.495789,
                lng: 129.415649,
            }}
            
            // style={{
            //     // 지도의 크기
            //     width: "40vh",
            //     height: "50vh",
            // }}
            level={4} // 지도의 확대 레벨
        >
            {busStopList.map((busStopList, index) => (
                <MapMarker
                key={`${busStopList.title}-${busStopList.latlng}`}
                position={busStopList.latlng} // 마커를 표시할 위치
                image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
                    size: {
                    width: 24,
                    height: 35
                    }, // 마커이미지의 크기입니다
                }}
                title={busStopList.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                />
            ))}
            <MapTypeId type={"TRAFFIC"} />
        </Map>
    );
}

export default KakaoMap