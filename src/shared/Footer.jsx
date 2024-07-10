import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <button onClick={() => navigate('/main')}>홈</button>
      <button onClick={() => navigate('/bus-route')}>버스 노선</button>
      <button onClick={() => navigate('/favorites')}>즐겨찾기</button>
      <button onClick={() => navigate('/profile')}>내 정보</button>
    </footer>
  );
}

export default Footer;
