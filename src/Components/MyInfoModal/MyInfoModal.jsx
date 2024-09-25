import ReactDOM from "react-dom";
import "./MyInfoModal.module.css";

const MyInfoModal = ({ showModal, onClose }) => {
  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div className="myInfoModal" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <p>안녕하세요</p>
        </div>
        <div className="modalBody">
          <div className="userInfo">
            <img src="" alt="" />
            <p>[{"울산과학대"}] 접속 상태</p>
          </div>
          <button className="logoutButton">로그아웃</button>
        </div>
        <div className="modalFooter">
          <p>잘 이용해주셔서 감사합니다.</p>
          <p>버그, 문의, 개선사항 등등</p>
          <p>test123@gmail.com으로</p>
          <p>보내주시면 감사하겠습니다!!</p>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default MyInfoModal;