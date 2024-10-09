import useStore from "store/UseStore";
import styles from "./SearchBar.module.css";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const { tabHeight, maxHeight, footerHeight } = useStore();
  const [searchBarTop, setSearchBarTop] = useState(0);
  const [stationName, setStationName] = useState("");

  useEffect(() => {
    const updateSearchBarPosition = () => {
      const topMargin = 20;
      const newTop = window.innerHeight - maxHeight - footerHeight - 80;// Math.max(topMargin, window.innerHeight - maxHeight - 80);
      setSearchBarTop(newTop);
    };

    updateSearchBarPosition();
    window.addEventListener('resize', updateSearchBarPosition);
    return () => window.removeEventListener('resize', updateSearchBarPosition);
  }, [maxHeight, tabHeight]);

  /**
   * 정류장 검색
   * POST
   * 서비스 엔드포인트: "http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/station"
   * 개발 환경 엔드포인트: "http://localhost:8085/api/station/search"
   */
  const onSearch = async () => {
    const endpoint = stationName
      ? "http://localhost:8085/api/station/search"
      : "http://localhost:8085/api/station/all"; // stationName이 없으면 /all로 요청
    const requestBody = stationName ? { name: stationName } : {}; // stationName이 있으면 전송
    try {
      console.log(`${stationName} 정류장으로 검색 중...`);
      const response = await fetch(endpoint, {
        method: stationName ? "POST" : "GET", // /search 요청은 POST, /all 요청은 GET
        headers: {
          "Content-Type": "application/json",
        },
        ...(stationName && { body: JSON.stringify(requestBody) }), // stationName이 있을 때만 body 전송
      });
      if (!response.ok) {
        throw new Error("정류장 검색에 실패했습니다.");
      }
      const data = await response.json();
      console.log("검색 결과:", data);
    } catch (error) {
      console.error("오류 발생:", error.message);
    }
  };

  // useEffect로 전역적으로 Enter 키 감지
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        onSearch();
      }
    };
    // 컴포넌트가 마운트될 때 이벤트 리스너 추가
    window.addEventListener("keydown", handleKeyPress);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [stationName]); // stationName이 변경될 때마다 효과 실행

  return (
    <div className={styles.body} style={{ top: `${searchBarTop}px` }} >
      {/* Text Input Area */}
      <input
        className={styles.textInputArea}
        placeholder="검색할 정류장을 입력해주세요."
        value={stationName}
        onChange={(e) => setStationName(e.target.value)} // 입력값을 state로 관리
      />
      {/* Search Button */}
      <button className={styles.searchBtn} onClick={onSearch} >
        검색
      </button>
    </div>
  );
}