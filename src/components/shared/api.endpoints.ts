const AUTH_BASE = "/auth";

export const API_ENDPOINTS = {

    AUTH: {
        BASE: AUTH_BASE,
        LOGIN: `${AUTH_BASE}/login`,
        REGISTER: `${AUTH_BASE}/register`,
        REFRESH: `${AUTH_BASE}/refresh`,
        LOGOUT: `${AUTH_BASE}/logout`,
        FORGOT_PASSWORD: `${AUTH_BASE}/forgot-password`,
        CREATE_NEW_PASSWORD: `${AUTH_BASE}/reset-password`,
        VERIFY_EMAIL: `${AUTH_BASE}/verify-email`,
        RESEND_VERIFICATION_EMAIL: `${AUTH_BASE}/resend-verification`,

    }
} as const;