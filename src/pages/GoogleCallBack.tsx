import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAccessToken } from '../api/axios.instance';
import { LoadingFallback } from '../components/feedback/LoadingFallBack';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      setAccessToken(token);
      navigate('/dashboard', { replace: true });
    } else {

        navigate('/auth/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return <LoadingFallback />;
};