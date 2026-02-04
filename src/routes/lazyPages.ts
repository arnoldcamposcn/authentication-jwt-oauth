import { lazy } from 'react';

export const FormLogin = lazy(() =>
  import('../components/auth/forms/LoginForm').then(m => ({ default: m.FormLogin }))
);

export const FormRegister = lazy(() =>
  import('../components/auth/forms/RegisterForm').then(m => ({ default: m.FormRegister }))
);

export const FormVerifyEmail = lazy(() =>
  import('../components/auth/forms/VerifyEmailForm').then(m => ({ default: m.FormVerifyEmail }))
);

export const FormRecoverPassword = lazy(() =>
  import('../components/auth/forms/RecoverPasswordForm').then(m => ({ default: m.FormRecoverPassword }))
);

export const FormCreateNewPassword = lazy(() =>
  import('../components/auth/forms/CreateNewPasswordForm').then(m => ({ default: m.FormCreateNewPassword }))
);

export const Dashboard = lazy(() =>
  import('../pages/Dashboard').then(m => ({ default: m.Dashboard }))
);
