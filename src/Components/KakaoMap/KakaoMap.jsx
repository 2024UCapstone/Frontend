import { Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import "./KakaoMap.css";
import { useEffect, useState } from "react";
import { BusStopIcon } from "assets/images";
import useFetchData from "hooks/useFetchData";
// import useGeoLocation from "../hooks/useGeoLocation";

function KakaoMap() {
    // const location = useGeoLocation()
    const [state, setState] = useState({
        center: {
            lat: 35.495789,
            lng: 129.415649,
        },
        errMsg: null,
        isLoading: true,
    })

    useEffect(() => {
        if (navigator.geolocation) {
          // GeoLocation을 이용해서 접속 위치를 얻어옵니다
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setState((prev) => ({
                ...prev,
                center: {
                  lat: position.coords.latitude, // 위도
                  lng: position.coords.longitude, // 경도
                },
                isLoading: false,
              }))
            },
            (err) => {
              setState((prev) => ({
                ...prev,
                errMsg: err.message,
                isLoading: false,
              }))
            }
          )
        } else {
          // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
          setState((prev) => ({
            ...prev,
            errMsg: "geolocation을 사용할수 없어요..",
            isLoading: false,
          }))
        }
    }, [])
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
    ];

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
            center={state.center}
            level={4} // 지도의 확대 레벨
        >
            {!state.isLoading && (
                <MapMarker position={state.center}>
                    <div style={{ padding: "5px", color: "#000" }}>
                    {state.errMsg ? state.errMsg : "여기에 계신가요?!"}
                    </div>
                </MapMarker>
            )}
        {busStopList.map((busStopList, index) => (
            <MapMarker
            key={`${busStopList.title}-${busStopList.latlng}`}
            position={busStopList.latlng} // 마커를 표시할 위치
            image={{
                src: BusStopIcon, // 마커이미지의 주소입니다
                size: {
                width: 35,
                height: 35,
                }, // 마커이미지의 크기입니다
            }}
            
            title={busStopList.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            />
        ))}
        <MapTypeId type={"TRAFFIC"} />
        </Map>
    );
}

export default KakaoMap;
