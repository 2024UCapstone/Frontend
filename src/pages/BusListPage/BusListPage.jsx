import React from "react";
import { useNavigate } from "react-router-dom";
import "./BusListPage.css"
import busIcon from "../../assets/Image/free-icon-bus-1168001.png";
import Footer from "../../components/Footer/Footer";

function BusListPage() {
  const navigate = useNavigate();

  return (
    <div className="BusListPage">
      {/* 현 34rem으로 지정 */}
      <h3>{"울산과학대의 버스 목록"}</h3>
      <ul>
        {/* 여긴 나중에 li map 돌면 될 듯. */}
        <li onClick={() => navigate('/bus-route')}>
          <img src={busIcon} alt="bus icon" />
          <p>등교버스 ( 동캠방면 )</p>
        </li>
        <li>
          <img src={busIcon} alt="bus icon" />
          <p>하교버스 ( @@ 방면 )</p>
        </li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <Footer />
    </div>
  );
};

export default BusListPage;