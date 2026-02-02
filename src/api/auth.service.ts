
import { api, setAccessToken } from "./axios.instance";
import { AuthResponse, LoginData, RefreshResponse, RegisterData, ResetPasswordPayload } from "../types/auth";

export const authService = {

  login: async (payload: LoginData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const { data } = await api.post<RefreshResponse>("/auth/refresh");
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      // Siempre limpiar el token en memoria, incluso si falla la petición
      setAccessToken(null);
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  createNewPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await api.post("/auth/reset-password", payload);
  }
};
