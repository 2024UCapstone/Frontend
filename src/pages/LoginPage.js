import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import HelpIcon from '../shared/HelpIcon';


function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/enter-code');
  };

  return (
    <div className="container">
      <div className="content">
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/Image/free-icon-bus-1168001.png'} alt='Bus Logo' />
        </div>
        <div className="title">내 버스 찾아죠</div>
        <div className="loginButtons">
          <button onClick={handleLogin}>Continue with Google</button>
          <button onClick={handleLogin}>Continue with Microsoft Account</button>
          <button onClick={handleLogin}>Continue with Apple</button>
        </div>
      </div>
      <HelpIcon />
    </div>
  );
}

export default LoginPage;
