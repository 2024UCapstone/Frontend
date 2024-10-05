import React from "react";
import './AdminBusStopPage.css'
import { useNavigate } from "react-router-dom";
import Footer from "components/Footer/Footer";

function AdminBusStopPage() {
  const navigate = useNavigate();

  return (
    <div className="AdminPage">
        <div className="busStopButton" onClick={() => navigate("bus-stop")}>
            정류장
        </div>
        <div className="busButton" onClick={() => navigate("bus")}>
            버스
        </div>
        <Footer />
    </div>
  );
}

export default AdminBusStopPage;