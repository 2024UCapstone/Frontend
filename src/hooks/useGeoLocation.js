import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: null,
    error: null
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation(state => ({
        ...state,
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported",
        }
      }));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loaded: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            error: null
          });
        },
        (error) => {
          setLocation({
            loaded: true,
            coordinates: null,
            error: {
              code: error.code,
              message: error.message,
            }
          });
        }
      );
    }
  }, []);

  return location;
};

export default useGeolocation;
