import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const isLoggedIn = () => {
    const token = localStorage.getItem('token');

    if (!token){
        return false;
    }

    try {
        const decodedToken = jwtDecode(token); // Decoding the token using jwt-decode
        const currentTime = Date.now() / 1000; // Get current time in seconds

        // Check if the token's expiration time is greater than the current time
        if (decodedToken.exp && decodedToken.exp > currentTime) {
        // Token exists and is not expired
        return true;
        } else {
        // Token exists but is expired
        return false;
        }
    } catch (error) {
        // If there's an error decoding the token (invalid token format, etc.), consider it as invalid
        return false;
    }

}

// This hook runs every 5 seconds to check if the token is valid (not timed out.)
const useSessionTimeOutCheck = () => {
    const [tokenValid, setTokenValid] = useState(isLoggedIn());

    useEffect(() => {
        const checkTokenValidity = () => {    
            setTokenValid(isLoggedIn());
        };

        // Initial check when the component mounts
        checkTokenValidity();

        // Check token validity every x seconds (adjust the interval as needed)
        const intervalId = setInterval(checkTokenValidity, 5000); // Check every 5 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return tokenValid;
};

export { isLoggedIn, useSessionTimeOutCheck }