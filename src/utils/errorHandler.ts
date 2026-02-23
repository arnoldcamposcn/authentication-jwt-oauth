import { AxiosError } from "axios";
import { toast } from "react-toastify";
import i18n from "../i18n/config";

/* =====================================================
   OBTENER ERROR CODE DESDE AXIOS
===================================================== */
export const getErrorCode = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Error de red (backend no respondió)
    if (!error.response) return "NETWORK_ERROR";

    const data = error.response.data as { errorCode?: string } | undefined;

    // Nuevo formato del backend
    if (data?.errorCode && typeof data.errorCode === "string") {
      return data.errorCode;
    }

    // Fallback por status HTTP
    return getErrorCodeFromStatus(error.response.status);
  }

  return "UNEXPECTED_ERROR";
};

/* =====================================================
   MAPEO FALLBACK POR STATUS HTTP
===================================================== */
const getErrorCodeFromStatus = (status: number): string => {
  const map: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
  };

  return map[status] || "UNKNOWN_ERROR";
};

/* =====================================================
   TRADUCIR MENSAJE AUTOMÁTICAMENTE
===================================================== */
export const getErrorMessage = (error: unknown): string => {
  const code = getErrorCode(error);
  const key = `errors.${code}`;

  // i18next devuelve la clave si no existe traducción
  const translated = i18n.t(key);

  if (translated === key) {
    // 🔎 Log útil en desarrollo si falta traducción
    if (import.meta.env.DEV) {
      console.warn(`⚠️ Missing translation for error code: ${code}`);
    }

    return i18n.t("errors.UNEXPECTED_ERROR");
  }

  return translated;
};

/* =====================================================
   VERIFICAR SI NO DEBE INTENTAR REFRESH
===================================================== */
export const shouldNotRefresh = (errorCode: string, url?: string): boolean => {
  // Códigos de error que NO deben intentar refresh
  const noRefreshErrorCodes = [
    "AUTH_INVALID_CREDENTIALS",
    "AUTH_EMAIL_ALREADY_REGISTERED",
    "REFRESH_TOKEN_MISSING",
    "REFRESH_TOKEN_INVALID",
    "RESET_TOKEN_INVALID_OR_EXPIRED",
    "EMAIL_SEND_ERROR",
  ];

  if (noRefreshErrorCodes.includes(errorCode)) {
    return true;
  }

  // Endpoints públicos que NO deben intentar refresh
  const publicAuthEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  return publicAuthEndpoints.some((endpoint) => url?.includes(endpoint));
};

/* =====================================================
   MANEJAR ERROR Y MOSTRAR TOAST
===================================================== */
export const handleError = (
  error: unknown,
  showToast = true,
  defaultMessage?: string
): string => {
  const message = getErrorMessage(error);
  const finalMessage = message || defaultMessage || i18n.t("errors.UNEXPECTED_ERROR");

  if (showToast) {
    toast.error(finalMessage);
  }

  return finalMessage;
};
