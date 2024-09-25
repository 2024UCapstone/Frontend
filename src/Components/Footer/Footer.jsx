import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";
import busIcon from "../../assets/Image/free-icon-bus-1168001.png";
import MyInfoModal from "../MyInfoModal/MyInfoModal";
import { useState } from "react";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const navigate = useNavigate();

  return (
    <footer className={styles.Footer}>
      <button onClick={handleModal}>
        <img src={busIcon} alt="마이페이지" />
        <p>내 정보</p>
        <MyInfoModal showModal={showModal} onClose={handleModal} />
      </button>
      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        <img src={busIcon} alt="homeImg" />
        <p>홈</p>
      </button>
      <button
        onClick={() => {
          navigate("/bus-list");
        }}
      >
        <img src={busIcon} alt="bus-icon" />
        <p>버스 노선</p>
      </button>
      <button onClick={() => {}}>
        <img src={busIcon} alt="my" />
        <p>즐겨찾기</p>
      </button>
    </footer>
  );
};

export default Footer;
