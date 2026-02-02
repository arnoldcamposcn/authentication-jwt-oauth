import { authService } from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../atoms/Button';

export const LogoutButton = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success('Sesión cerrada exitosamente');
            navigate('/auth/login');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
            navigate('/auth/login');
        }
    };

    return (
        <Button
            onClick={handleLogout}
            variant="danger"
        >
            Cerrar sesión
        </Button>
    );
};