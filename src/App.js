import { Route, Routes } from "react-router-dom";
import LoginPage from "pages/LoginPage/LoginPage";
import EnterCodePage from "pages/EnterCodePage/EnterCodePage";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import HomePage from "pages/HomePage/HomePage";
import DetailFavoritesListPage from "pages/DetailFavoritesListPage/DetailFavoritesListPage";
import BusListPage from "pages/BusListPage/BusListPage";
import BusRoutePage from "pages/BusRoutePage/BusRoutePage";
import BusDirectionPage from "pages/BusDirectionPage/BusDirectionPage";
import AdminPage from "pages/AdminPage/AdminPage/AdminPage";
// import AdminBusStationPage from "pages/AdminPage/BusStationPage/AdminBusStopPage";
import axios from "axios";

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
        <Route
          path="detailfavoriteslist"
          element={<DetailFavoritesListPage />}
        />
        <Route path="/bus-direction" element={<BusDirectionPage />} />
        <Route path="/bus-list" element={<BusListPage />} />
        <Route path="/bus-route" element={<BusRoutePage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* <Route path="/admin/bus-station/create" element={<AdminBusStationPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
