import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BusRoutePage.css";
import { BusIcon } from "assets/images";
import Footer from "components/Footer/Footer";

function BusRoutePage() {
  const [favorites, setFavorites] = useState([
    { id: 1, name: "울산과학대 서부캠퍼스", isFavorite: false },
    { id: 2, name: "집에갈래요", isFavorite: true },
    { id: 3, name: "집에보내줄까", isFavorite: false },
    { id: 4, name: "어림도 없지", isFavorite: false },
    { id: 5, name: "ㅠㅠ", isFavorite: false },
    { id: 6, name: "울산과학대 동부캠퍼스", isFavorite: false },
  ]);

  const toggleFavorite = (id) => {
    setFavorites(
      favorites.map((stop) =>
        stop.id === id ? { ...stop, isFavorite: !stop.isFavorite } : stop
      )
    );
  };

  return (
    <div className="BusRoutePage">
      {/* 현 34rem으로 지정 */}
      <h3>{"울산과학대의 버스 목록"}</h3>
      <ul>
        {favorites.map((stop, index) => (
          <li
            key={stop.id}
            className={`bus-stop-item ${
              index !== favorites.length - 1 ? "connected" : ""
            }`}
          >
            <div className="circle"></div>
            <p className="bus-stop-list">{stop.name}</p>
            <button
              className="favorite-button"
              onClick={() => toggleFavorite(stop.id)}
            >
              {stop.isFavorite ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default BusRoutePage;
