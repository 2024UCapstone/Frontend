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
import AdminBusStopPage from "pages/AdminPage/BusStop/AdminBusStopPage";

function App() {
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
        <Route path="/admin/bus-stop" element={<AdminBusStopPage />} />
      </Routes>
    </div>
  );
}

export default App;
