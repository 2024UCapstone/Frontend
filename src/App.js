import logo from './logo.svg';
// import './App.css';
import LoginPage from './pages/LoginPage';
import EnterCodePage from './pages/EnterCodePage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/enter-code" element={<EnterCodePage />} />
      </Routes>
    </div>
  );
}

export default App;
