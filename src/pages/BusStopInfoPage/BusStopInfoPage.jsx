import React, { useEffect } from "react";
import "./BusStopInfoPage.css";
import KakaoMap from "components/KakaoMap/KakaoMap";
import ViewBusComponent from "components/ViewBusComponent/ViewBusComponent";
import Footer from "components/Footer/Footer";

function BusStopInfoPage() {
  return (
    <div className="BusStopInfoPage">
      <KakaoMap />
      <ViewBusComponent />
      {/* <Footer /> */}
    </div>
  );
}

export default BusStopInfoPage;
