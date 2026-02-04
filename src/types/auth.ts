import z from "zod";

// ============================================
// LOGIN
// ============================================
export const loginSchema = z.object({
    email: z.string().email("El email no es válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const INITIAL_LOGIN_DATA: LoginData = {
    email: "",
    password: "",
};

// ============================================
// REGISTER
// ============================================
export const registerSchema = z.object({
    email: z.string().email("El email no es válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RegisterData = z.infer<typeof registerSchema>;

export const INITIAL_REGISTER_DATA: RegisterData = {
    email: "",
    password: "",
};

// ============================================
// RECOVER PASSWORD
// ============================================
export const recoverPasswordSchema = z.object({
    email: z.string().email("El email no es válido"),
});

export type RecoverPasswordData = z.infer<typeof recoverPasswordSchema>;

export const INITIAL_RECOVER_PASSWORD_DATA: RecoverPasswordData = {
    email: "",
};

// ============================================
// CREATE NEW PASSWORD (RESET)
// ============================================


export const createNewPasswordSchema = z.object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    token: z.string().min(1, "El token es requerido").optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});


export type CreateNewPasswordData = z.infer<typeof createNewPasswordSchema>;

export const INITIAL_CREATE_NEW_PASSWORD_DATA: CreateNewPasswordData = {
    password: "",
    confirmPassword: "",
    token: "",
};


export type ResetPasswordPayload = {
    token: string;
    password: string;
};


// ============================================
// API RESPONSES
// ============================================
export interface AuthResponse {
    accessToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}

// ============================================
// VERIFY EMAIL
// ============================================
export const verifyEmailSchema = z.object({
    email: z.string().email("El email no es válido"),
    code: z.string().min(1, "El código es requerido"),
});

export type VerifyEmailData = z.infer<typeof verifyEmailSchema>;

export const INITIAL_VERIFY_EMAIL_DATA: VerifyEmailData = {
    email: "",
    code: "",
};