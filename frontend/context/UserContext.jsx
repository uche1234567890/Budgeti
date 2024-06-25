/* eslint-disable react/prop-types */
import { useContext, createContext, useState, useEffect } from 'react'

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = (props) => {
    const [authUser, setAuthUser] = useState(() => {
        const savedUser = localStorage.getItem('authUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const savedLoggedIn = localStorage.getItem('isLoggedIn');
        return savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    });

    useEffect(() => {
        localStorage.setItem('authUser', JSON.stringify(authUser));
    }, [authUser]);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Decode the token to get the expiration time
            const { exp } = JSON.parse(atob(token.split('.')[1]));

            const expirationTime = exp * 1000 - Date.now();
            if (expirationTime > 0) {
                const timer = setTimeout(() => {
                    setIsLoggedIn(false);
                    setAuthUser(null);
                    localStorage.removeItem('authUser');
                    localStorage.removeItem('isLoggedIn');
                }, expirationTime);

                return () => clearTimeout(timer);
            } else {
                setIsLoggedIn(false);
                setAuthUser(null);
                localStorage.removeItem('authUser');
                localStorage.removeItem('isLoggedIn');
            }
        }
    }, [authUser]);

    const value = {authUser, setAuthUser, isLoggedIn, setIsLoggedIn}

    return (
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
    )
}