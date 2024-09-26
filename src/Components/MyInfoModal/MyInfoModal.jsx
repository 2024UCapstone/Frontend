import ReactDOM from "react-dom";
import "./MyInfoModal.module.css";

const MyInfoModal = ({ showModal, onClose }) => {
  if (!showModal) return null;

  return (
    <div className="MyInfoModal">
      모달창
    </div>
  );
};

export default MyInfoModal;