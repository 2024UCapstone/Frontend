import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon, HomeIcon, BusStopIcon, AdminIcon } from "assets/images";
import { useModalActions, useModalState } from "store/UseModalStore";
import { useHeightState } from "store/UseHeightStore";
import axios from "axios";
import { useEffect, useState } from "react";

const Footer = () => {
  const { modalName } = useModalState();
  const [userInfo, setUserInfo] = useState(null); // 초기 상태를 null로 설정
  const { selectedModalOpen, setModalName } = useModalActions();
  const { footerHeight } = useHeightState();
  const navigate = useNavigate();

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "https://DevSe.gonetis.com/api/auth/user"
        );
        setUserInfo(response.data.data); // 서버에서 받은 데이터를 상태에 저장
      } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleModal = () => {
    setModalName("myInfoModal");
    selectedModalOpen("myInfoModal");
  };

  return (
    <footer className={styles.footer} style={{ height: `${footerHeight}px` }}>
      <button onClick={handleModal}>
        <img src={HamburgerIcon} alt="마이페이지" />
        <p>내 정보</p>
      </button>
      <button onClick={() => navigate("/home")}>
        <img src={HomeIcon} alt="homeImg" />
        <p>홈</p>
      </button>
      <button onClick={() => navigate("/bus-list")}>
        <img src={BusStopIcon} alt="bus-icon" />
        <p>버스 노선</p>
      </button>
      {/* userInfo가 로드되고, role이 ADMIN인 경우에만 관리자 페이지 버튼을 보여줌 */}
      {userInfo && userInfo.role === "ADMIN" && (
        <button onClick={() => navigate("/admin")}>
          <img src={AdminIcon} alt="관리자" />
          <p>관리자 페이지</p>
        </button>
      )}
    </footer>
  );
};

export default Footer;
