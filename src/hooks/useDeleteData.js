import { useState } from "react";
import axios from "axios";

const useDeleteData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const deleteData = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/${payload}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });
      setData(response.data);
      setError(null);
    } catch (error) {
      setData(null);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, deleteData };
};

export default useDeleteData;
