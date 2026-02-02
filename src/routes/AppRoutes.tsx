
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FormRegister } from '../components/auth/forms/RegisterForm';
import { FormLogin } from '../components/auth/forms/LoginForm';
import { Dashboard } from '../pages/Dashboard';
import { FormRecoverPassword } from '../components/auth/forms/RecoverPasswordForm';
import { FormCreateNewPassword } from '../components/auth/forms/CreateNewPasswordForm';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from '../pages/Home';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/auth/login" element={<FormLogin/>}/>
                <Route path="/auth/register" element={<FormRegister/>}/>
                <Route path="/dashboard" 
                element={<ProtectedRoute>
                    <Dashboard/>
                    </ProtectedRoute>
                    }/>
                <Route path="/auth/recover-password" element={<FormRecoverPassword/>}/>
                <Route path="/auth/create-new-password" element={<FormCreateNewPassword/>}/>
            </Routes>
        </BrowserRouter>
    );
};
