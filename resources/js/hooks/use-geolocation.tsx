import { useState, useEffect } from "react";

interface GeolocationPosition {
    latitude: number;
    longitude: number;
    error?: string;
}

export function useGeolocation() {
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("La geolocalización no está soportada por este navegador"));
                return;
            }

            setLoading(true);
            setError(null);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const result = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setPosition(result);
                    setLoading(false);
                    resolve(result);
                },
                (error) => {
                    const errorMessage = error.message || "Error al obtener la ubicación";
                    setError(errorMessage);
                    setLoading(false);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    };

    return {
        position,
        loading,
        error,
        getCurrentPosition,
    };
}
