// hooks/useEnterKey.js
import { useEffect } from "react";

export const useEnterKey = (ref, callback) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && ref.current) {
        callback();
      }
    };

    if (ref.current) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, callback]);
};
