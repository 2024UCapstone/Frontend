import { useState } from "react";
import axios from "axios";

const usePostData = (url) => {
  const [data, setData] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const postData = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true, // 이 옵션을 추가하여 쿠키를 포함시킵니다
      });
      setData(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      setData(false);
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, message, postData };
};

export default usePostData;
