'use client';

import { useState, useEffect } from 'react';

interface LocationState {
  latitud: number | null;
  longitud: number | null;
  error: string | null;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitud: null,
    longitud: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'La geolocalización no es soportada por este navegador.',
      }));
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        setLocation({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          error: null,
        });
        setIsLoading(false);
      },
      // Error callback
      (error) => {
        setLocation((prev) => ({ ...prev, error: error.message }));
        setIsLoading(false);
      }
    );
  }, []); // Empty array ensures this runs only once on mount

  return { ...location, isLoading };
};