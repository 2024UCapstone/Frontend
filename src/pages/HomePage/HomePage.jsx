import React, { useEffect } from "react";
import useStore from "store/UseStore";
import KakaoMap from "../../components/KakaoMap/KakaoMap";
import MapComponent from "components/MapComponent/MapComponent";
import Footer from "components/Footer/Footer";
import ViewBusComponent from "components/ViewBusComponent/ViewBusComponent";
import "./HomePage.css";

function HomePage() {

  return (
    <div className="HomePage">
      <KakaoMap />
      <ViewBusComponent />
      <Footer />
    </div>
  );
}

export default HomePage;
