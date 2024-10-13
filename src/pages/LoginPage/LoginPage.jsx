import styles from "./LoginPage.module.css";
import { BusIcon } from "assets/images";
import { GoogleIcon } from "assets/logos";

function LoginPage() {

  
  const handleLogin = async () => {
    window.location.href = 'http://DevSe.gonetis.com:12599/oauth2/authorization/google';
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
            <GoogleIcon className={styles["logo"]} /> 구글 계정으로 로그인
          </button>
        </div>
      </div>
      {/* <HelpIcon /> */}
    </div>
  );
}

export default LoginPage;
