import { useState } from "react";
import axios from "axios";

const useFetchData = (url) => {
  const [data, setData] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true, // 이 옵션을 추가하여 쿠키를 포함시킵니다
      });
      setData(response.data);
      setMessage(response.data);
    } catch (error) {
      setData(false);
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, message, fetchData };
};

export default useFetchData;