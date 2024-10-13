import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon, HomeIcon, BusStopIcon } from "assets/images";
import { useModalActions, useModalState } from "store/UseModalStore";
import { useHeightState } from "store/UseHeightStore";

const Footer = () => {
  const { modalName } = useModalState();
  const { selectedModalOpen, setModalName } = useModalActions();

  const { footerHeight } = useHeightState();
  const handleModal = () => {
    setModalName("myInfoModal");
    selectedModalOpen("myInfoModal");
  };

  const navigate = useNavigate();

  return (
    <footer className={styles.footer} style={{ height: `${footerHeight}px` }}>
      <button onClick={handleModal}>
        <img src={HamburgerIcon} alt="마이페이지" />
        <p>내 정보</p>
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
    </footer>
  );
};

export default Footer;
