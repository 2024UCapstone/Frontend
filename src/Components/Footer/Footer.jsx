import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";
import { BusIcon, HamburgerIcon, HomeIcon, BusStopIcon } from "assets/images";
import MyInfoModal from "components/MyInfoModal/MyInfoModal";
import { useState } from "react";
import useStore from "store/UseStore";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // 임시로 관리자인지 여부를 설정 (실제로는 API 응답을 통해 설정)
  const { footerHeight } = useStore();
  const handleModal = () => {
    setShowModal(!showModal);
  };

  const navigate = useNavigate();

  return (
    <footer className={styles.footer} style={{ height: `${footerHeight}px` }}>
      <button onClick={handleModal}>
        <img src={HamburgerIcon} alt="마이페이지" />
        <p>내 정보</p>
        <MyInfoModal
          showModal={showModal}
          onClose={handleModal}
          isAdmin={isAdmin}
        />
      </button>
      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        <img src={HomeIcon} alt="homeImg" />
        <p>홈</p>
      </button>
      <button
        onClick={() => {
          navigate("/bus-direction");
        }}
      >
        <img src={BusStopIcon} alt="bus-icon" />
        <p>버스 노선</p>
      </button>

      {isAdmin && (
        <button
          onClick={() => {
            navigate("/admin");
          }}
        >
          <img src={BusStopIcon} alt="bus-icon" />
          <p>관리자 페이지</p>
        </button>
      )}
    </footer>
  );
};

export default Footer;
