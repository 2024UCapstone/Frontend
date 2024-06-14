import React from 'react';
import { useNavigate } from 'react-router-dom';
import HelpIcon from '../shared/HelpIcon';
// import '../../styles/App.css';

function EnterCodePage() {
  const navigate = useNavigate();

  const handleAccess = () => {
    navigate('/loading');
  };

  return (
    <div className="container">
      <div className="content">
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/Image/free-icon-bus-1168001.png'} alt="Bus Logo" />
        </div>
        <div className="title">내 버스 찾아죠</div>
        <div className="inputContainer">
          <input type="text" placeholder="고유코드를 입력하세요." />
          <button type="button" onClick={handleAccess}>접속</button>
        </div>
      </div>
      <HelpIcon />
    </div>
  );
}

export default EnterCodePage;
