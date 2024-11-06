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
          message: "Geolocation not supported"
        }
      }));
      return;
    }

    // Success handler for both getCurrentPosition and watchPosition
    const handleSuccess = (position) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null
      });
    };

    // Error handler for both getCurrentPosition and watchPosition
    const handleError = (error) => {
      setLocation({
        loaded: true,
        coordinates: null,
        error: {
          code: error.code,
          message: error.message,
        }
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
};

export default useGeolocation;