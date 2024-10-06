import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EnterCodePage.module.css";
import HelpIcon from "components/HelpIconComponents/HelpIcon";
import { BusIcon } from "assets/images";
import useFetchData from "hooks/useFetchData";
import usePostData from "hooks/usePostData";

function EnterCodePage() {
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [isVaildSchool, setIsVaildSchool] = useState(null);
  const [hasVaildSchool, setHasVaildSchool] = useState(false);

  const [isVaildMail, setIsVaildMail] = useState(null);
  const [hasVaildMail, setHasVaildMail] = useState(false);

  const [isVaildCode, setIsVaildCode] = useState(null);
  const [hasVaildCode, setHasVaildCode] = useState(false);

  const { data: nameData, loading: nameLoad, message: nameMessage, postData: namePost } = usePostData(
    'http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/school/validation'
  );
  const { data: mailData, loading: mailLoad, message: mailMessage, postData: mailPost } = usePostData(
    'http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/school/mail'
  );
  const { data: codeData, loading: codeLoad, message: codeMessage, postData: codePost } = usePostData(
    'http://springboot-developer-env.eba-y8syvbmy.ap-northeast-2.elasticbeanstalk.com/api/school/code'
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (nameData !== null) {
      setIsVaildSchool(nameData);
      setHasVaildSchool(true);
    }
  }, [nameData]);

  useEffect(() => {
    if (mailData !== null) {
      setIsVaildMail(mailData);
      setHasVaildMail(true);
    }
  }, [mailData]);

  useEffect(() => {
    if (codeData !== null) {
      setIsVaildCode(codeData);
      setHasVaildCode(true);
    }
  }, [codeData]);

  const handleSchoolNameChange = (event) => {
    setSchoolName(event.target.value);
  };

  const handleSchoolEmailChange = (event) => {
    setSchoolEmail(event.target.value);
  };

  const handleSchoolCodeChange = (event) => {
    setSchoolCode(event.target.value);
  };

  const handleSchoolVerification = async() => {
    await namePost({schoolName: schoolName});
    setHasVaildSchool(true);
    if(nameData) setIsVaildSchool(true)
    else setIsVaildSchool(false);
  };

  const handleEmailVerification = async () => {
    if(isVaildSchool === false) return alert("학교명을 인증 후 메일을 인증해주세요!");
    await mailPost({
      schoolName: schoolName,
      schoolEmail: schoolEmail
    });
    setHasVaildMail(true);
    if(mailData) setIsVaildMail(true)
    else setIsVaildMail(false);
  };

  const handleCodeVerification = async() => {
    // if(isVaildMail === false) return alert("학교 메일 전송 후 코드를 입력해주세요!");

    // 인증 코드 로직 구현
    await codePost({
      schoolName: schoolName,
      schoolEmail: schoolEmail,
      code: schoolCode
    });
    setHasVaildCode(true);
    if(mailData) setIsVaildCode(true)
    else setIsVaildCode(false);

    if(isVaildCode) {
      alert(codeMessage);
      navigate("/home");
    }
  };

  return (
    <div className={styles["enterCodePage"]}>
      <div className={styles["logo"]}>
        <img src={BusIcon} className={styles["bus-icon"]} alt="Bus Logo" />
      </div>
      <div className={styles["title"]}>내 버스 찾아죠</div>
      <div className={styles["inputContainer"]}>
        <div className={styles["inputSchool"]}>
          <input
            className={styles["schoolName"]}
            type="text"
            placeholder="학교명을 입력하세요."
            value={schoolName}
            onChange={handleSchoolNameChange}
          />
          <button
            type="button"
            className={styles["validButton"]}
            onClick={handleSchoolVerification}
          >
            인증 가능 여부
          </button>
        </div>
        <p style={{display: hasVaildSchool === true ? 'block' : 'none'}} className={styles[isVaildSchool ? "success-message" : "error-message"]}>
          {nameMessage}
        </p>
        <div className={styles["inputSchool"]}>
          <input
            className={styles["schoolName"]}
            type="text"
            placeholder="학교 메일을 입력하세요."
            value={schoolEmail}
            onChange={handleSchoolEmailChange}
          />
          <button
            type="button"
            className={styles["validButton"]}
            onClick={handleEmailVerification}
          >
            인증 메일 전송
          </button>
        </div>
        <p style={{display: hasVaildMail === true ? 'block' : 'none'}} className={styles[isVaildMail ? "success-message" : "error-message"]}>
          {mailMessage}
        </p>
        <input
          className={styles["schoolEmail"]}
          type="text"
          placeholder="메일 인증 코드를 입력하세요."
          value={schoolCode}
          onChange={handleSchoolCodeChange}
        />
        <button
          type="button"
          className={styles["button"]}
          onClick={handleCodeVerification}
        >
          메일 인증
        </button>
      </div>
      <HelpIcon />
    </div>
  );
}

export default EnterCodePage;