import React, { useEffect } from "react";
import "./MyInfoModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFetchData from "hooks/useFetchData";

const MyInfoModal = ({ showModal, onClose, isAdmin }) => {
  const {data: userData, loading: userLoad, error: userError, fetchData} = useFetchData(`http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/auth/user`);
  // const {data: userData, loading: userLoad, error: userError, fetchData} = useFetchData("http://localhost:8080/api/auth/user");
  const navigate = useNavigate();

  useEffect(()=>{
    fetchData();
    console.log(userData?.data);
  }, [showModal])

  // 뒤로가기를 감지하는 useEffect
  useEffect(() => {
    if (showModal) {
      const handlePopState = () => {
        onClose(); // 뒤로가기를 눌렀을 때 모달 닫기
      };

      window.history.pushState(null, "", window.location.href); // 새로운 히스토리 추가
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [showModal, onClose]);

  if (!showModal) return null;

  const handleLogout = async() => {
    try {
      const response = await axios.post('http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/auth/logout', {}, {
      // const response = await axios.post('http://localhost:8080/api/auth/logout', {}, {

        withCredentials: true
      });

      if (response.data) {
        navigate("/");
      } else {
        console.error('로그아웃 실패:', response.data.message);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div className="MyInfoModal" onClick={onClose}>
      <div
        className={`modal-content ${showModal ? "modal-slide-in" : ""}`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="modal-header">환영합니다 <br/>{userData?.data?.name}님!</div>
        <div className="profile-image-container">
            <img 
              src={userData?.data?.picture} 
              alt="프로필 이미지" 
              className="profile-image"
            />
          </div>
        <div className="modal-body">
          <p>[{userData?.data?.school}] 접속 상태</p>
          <button className="logout-button" onClick={()=>handleLogout()}>
            로그아웃
          </button>
          {isAdmin && (
            <button
              className="admin-button"
              onClick={() => {
                navigate("/admin"); // 관리자 페이지로 이동
              }}
            >
              관리자 페이지로 이동
            </button>
          )}
        </div>
        <div className="modal-footer">
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
