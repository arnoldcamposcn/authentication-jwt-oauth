import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from '../pages/Home';
import { LoadingFallback } from '../components/feedback/LoadingFallBack';
import {
  FormLogin,
  FormRegister,
  FormVerifyEmail,
  FormRecoverPassword,
  FormCreateNewPassword,
  Dashboard,
  GoogleCallback
} from './lazyPages';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/auth/login" element={<FormLogin/>}/>
                    <Route path="/auth/register" element={<FormRegister/>}/>
                    <Route path="/auth/verify-email" element={<FormVerifyEmail/>}/>
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/auth/recover-password" element={<FormRecoverPassword/>}/>
                    <Route path="/auth/create-new-password" element={<FormCreateNewPassword/>}/>
                    <Route path="/auth/google/callback" element={<GoogleCallback/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
