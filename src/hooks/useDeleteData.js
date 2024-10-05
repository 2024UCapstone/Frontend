import { useState } from "react";
import axios from "axios";

const useDeleteData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(url, {
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

  return { data, loading, error, deleteData };
};

export default useDeleteData;
