import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { BusIcon } from "assets/images";
import { AppleIcon, GoogleIcon, MicrosoftIcon } from "assets/logos";
// import HelpIcon from '../../components/HelpIcon/HelpIcon';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/enter-code");
  };

  return (
    <div className={styles["LoginPage"]}>
      <div className={styles["content"]}>
        <div>
          <img src={BusIcon} className={styles["bus-icon"]} alt="Bus Logo" />
        </div>
        <div className={styles["title"]}>내 버스 찾아죠</div>
        <div className={styles["loginButtons"]}>
          <button onClick={handleLogin}>
            <GoogleIcon className={styles["logo"]} /> Continue with Google
          </button>
          <button onClick={handleLogin}>
            <MicrosoftIcon className={styles["logo"]} /> Continue with Microsoft
            Account
          </button>
          <button onClick={handleLogin}>
            <AppleIcon className={styles["logo"]} />
            Continue with Apple
          </button>
        </div>
      </div>
      {/* <HelpIcon /> */}
    </div>
  );
}

export default LoginPage;
