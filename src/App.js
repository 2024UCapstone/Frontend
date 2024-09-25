import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "pages/LoginPage/LoginPage";
import EnterCodePage from "pages/EnterCodePage/EnterCodePage";
import LoadingPage from "pages/LoadingPage/LoadingPage";
import HomePage from "pages/HomePage/HomePage";
import DetailFavoritesListPage from "pages/DetailFavoritesListPage/DetailFavoritesListPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/enter-code" element={<EnterCodePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="detailfavoriteslist"
          element={<DetailFavoritesListPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
