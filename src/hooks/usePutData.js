import { useState } from "react";
import axios from "axios";

const usePutData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.put(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, putData };
};

export default usePutData;
