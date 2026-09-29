const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { get, post } from "./apiClient";

export function changePassword(
    currentPassword,
    newPassword
) {
    return post("/auth/change-password", {
        currentPassword,
        newPassword,
    });
}

export async function login(
    employeeNumber,
    password
) {
    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employeeNumber,
                password,
            }),
        }
    );

    if (!response.ok) {
        const data =
            await response.json();

        const error =
            new Error(data.message);

        error.attemptsRemaining =
            data.attemptsRemaining;

        error.retryAfterSeconds =
            data.retryAfterSeconds;

        throw error;
    }

    return response.json();
}

export function logout() {
    localStorage.removeItem("lms_token");

    // Temporary cleanup for users from the old version.
    localStorage.removeItem("lms_user");
}

export function getToken() {
    return localStorage.getItem("lms_token");
}

export function getCurrentUser() {
    return get("/auth/me");
}