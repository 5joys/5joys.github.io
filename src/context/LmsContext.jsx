import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    login as apiLogin,
    logout as apiLogout,
    getCurrentUser,
    getToken,
} from "../services/lms/authService";

const LmsContext = createContext(null);

export function LmsProvider({ children }) {
    const [currentUser, setCurrentUser] =
        useState(null);

    const [authLoading, setAuthLoading] =
        useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const token = getToken();

            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const user =
                    await getCurrentUser();

                setCurrentUser({
                    employeeNumber:
                        user.employeeNumber,
                    role:
                        user.role,
                });

            } catch {
                apiLogout();
                setCurrentUser(null);

            } finally {
                setAuthLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (
        employeeNumber,
        password
    ) => {
        const result = await apiLogin(
            employeeNumber,
            password
        );

        localStorage.setItem(
            "lms_token",
            result.token
        );

        const user = {
            employeeNumber:
                result.employeeNumber,
            role:
                result.role,
        };

        setCurrentUser(user);

        return user;
    };

    const logout = () => {
        apiLogout();
        setCurrentUser(null);
    };

    const value = useMemo(
        () => ({
            currentUser,
            authLoading,
            login,
            logout,
        }),
        [
            currentUser,
            authLoading,
        ]
    );

    return (
        <LmsContext.Provider value={value}>
            {children}
        </LmsContext.Provider>
    );
}

export function useLms() {
    const ctx = useContext(LmsContext);

    if (!ctx) {
        throw new Error(
            "useLms must be used within LmsProvider"
        );
    }

    return ctx;
}