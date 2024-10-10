import { Route, Routes } from "react-router-dom";
import LoginPage from "pages/LoginPage/LoginPage";
import EnterCodePage from "pages/EnterCodePage/EnterCodePage";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import HomePage from "pages/HomePage/HomePage";
import BusListPage from "pages/BusListPage/BusListPage";
import BusRoutePage from "pages/BusRoutePage/BusRoutePage";
import BusDirectionPage from "pages/BusDirectionPage/BusDirectionPage";
import AdminPage from "pages/AdminPage/AdminPage/AdminPage";
import AdminBusStationCreatePage from "pages/AdminPage/BusStationCreatePage/AdminBusStationCreatePage";
import axios from "axios";
import BusStationPage from "pages/AdminPage/BusStationPage/BusStationPage";
import BusStationEditPage from "pages/AdminPage/BusStationEditPage/BusStationEditPage";

function App() {
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/enter-code" element={<EnterCodePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/bus-direction" element={<BusDirectionPage />} />
        <Route path="/bus-list" element={<BusListPage />} />
        <Route path="/bus-route" element={<BusRoutePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/bus-station" element={<BusStationPage />} />
        <Route path="/admin/bus-station/create" element={<AdminBusStationCreatePage />} />
        <Route path="/admin/bus-station/edit/:stationId" element={<BusStationEditPage />} />
      </Routes>
    </div>
  );
}

export default App;
