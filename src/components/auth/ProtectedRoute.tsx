import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../../api/axios.instance';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};