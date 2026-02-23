import { api, setAccessToken } from "./axios.instance";
import { AuthResponse, LoginData, RefreshResponse, RegisterData, ResetPasswordPayload } from "../types/auth";
import { API_ENDPOINTS } from "../components/shared/api.endpoints";

export const authService = {

  login: async (payload: LoginData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },

  register: async (payload: RegisterData): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },
  
  refresh: async (): Promise<RefreshResponse> => {
    const { data } = await api.post<RefreshResponse>(API_ENDPOINTS.AUTH.REFRESH);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Siempre limpiar el token en memoria, incluso si falla la petición
      setAccessToken(null);
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  createNewPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.CREATE_NEW_PASSWORD, payload);
  },

  verifyEmail: async (payload: { email: string; code: string }): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
    return data;
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL, { email });
  },
};
