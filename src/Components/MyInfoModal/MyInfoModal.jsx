import React, { useEffect, useState } from "react";
import styles from "./MyInfoModal.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFetchData from "hooks/useFetchData";
import { useModalActions, useModalState } from "store/UseModalStore";

const MyInfoModal = () => {
  const { data: userData, loading: userLoad, error: userError, fetchData } = useFetchData(`http://DevSe.gonetis.com:12599/api/auth/user`);
  const navigate = useNavigate();
  const { isModal, modalName } = useModalState();
  const { selectedModalClose } = useModalActions();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchData();
    console.log(userData?.data);
  }, [])

  useEffect(() => {
    if (isModal && modalName === "myInfoModal") {
      setIsVisible(true);
      const handlePopState = () => {
        selectedModalClose(modalName);
      };

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else {
      setIsVisible(false);
    }
  }, [isModal, modalName, selectedModalClose]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://DevSe.gonetis.com/api/auth/logout', {}, {
        withCredentials: true
      });

      if (response.data) {
        sessionStorage.removeItem('token');
        selectedModalClose(modalName);
        navigate("/");
      } else {
        console.error('로그아웃 실패:', response.data.message);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div className={`${styles.myInfoModal} ${isVisible ? styles.show : ''}`} onClick={() => selectedModalClose(modalName)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => selectedModalClose(modalName)}>
          ×
        </button>
        <div className={styles.modalHeader}>환영합니다 <br />{userData?.data?.name}님!</div>
        <div className={styles.profileImageContainer}>
          <img
            src={userData?.data?.picture}
            alt="프로필 이미지"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.modalBody}>
          <p>[{userData?.data?.school}] 접속 상태</p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
        <div className={styles.modalFooter}>
          <p>
            잘 이용해주셔서 감사합니다. 버그, 문의, 개선사항 등은
            test123@gmail.com으로 보내주세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyInfoModal;