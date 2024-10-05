import React from "react";
import { useNavigate } from "react-router-dom";
import './BusDirectionPage.css'
import { BusIcon } from "assets/images";
import Footer from "components/Footer/Footer";

function BusDirectionPage() {
  const navigate = useNavigate();

  return (
    <div className="BusDirectionPage">
      {/* 현 34rem으로 지정 */}
      <h3>{"울산과학대의 버스 목록"}</h3>
      <ul>
        {/* 여긴 나중에 li map 돌면 될 듯. */}
        <li onClick={() => navigate("/bus-list")}>
          <img src={BusIcon} alt="bus icon" />
          <p>등교버스 ( 동캠방면 )</p>
        </li>
        <li onClick={() => navigate("/bus-list")}>
          <img src={BusIcon} alt="bus icon" />
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
}

export default BusDirectionPage;
