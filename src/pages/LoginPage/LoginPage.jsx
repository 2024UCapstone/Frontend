import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./LoginPage.module.css";

// import HelpIcon from '../../components/HelpIcon/HelpIcon';


function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/enter-code');
  };

  return (
    <div className={styles["LoginPage"]}>
      <div className={styles["content"]}>
        <div className={styles["logo"]}>
          <img src={process.env.PUBLIC_URL + '/Image/free-icon-bus-1168001.png'} className={styles["bus-icon"]} alt='Bus Logo' />
        </div>
        <div className={styles["title"]}>내 버스 찾아죠</div>
        <div className={styles["loginButtons"]}>
          <button onClick={handleLogin}>Continue with Google</button>
          <button onClick={handleLogin}>Continue with Microsoft Account</button>
          <button onClick={handleLogin}>Continue with Apple</button>
        </div>
      </div>
      {/* <HelpIcon /> */}
    </div>
  );
}

export default LoginPage;
