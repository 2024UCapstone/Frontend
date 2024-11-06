import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "store/UseAuthStore";

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);
        await fetchUser(); // 유저 정보를 가져와서 상태에 저장
        navigate("/home");
      } else {
        navigate("/");
      }
    };

    getToken();
  }, [fetchUser, navigate]);

  return <div>로그인 중입니다...</div>;
}

export default OAuthCallbackPage;
