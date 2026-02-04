import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterData } from '../../../types/auth'
import { toast } from 'react-toastify'
import { authService } from '../../../api';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Input } from '../../atoms/Input'
import { Button } from '../../atoms/Button';
import { handleError } from '../../../utils/errorHandler'
import { logger } from '../../../utils/logger'

export const FormRegister = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema)
    })


    const onSubmit = async (data: RegisterData) => {
        try {
            await authService.register(data)

            localStorage.setItem('pendingVerificationEmail', data.email)

            logger.log('Email guardado para verificación:', data.email)
            reset()
            toast.success('Registro exitoso. Revisa tu correo para verificar tu cuenta.')

            setTimeout(() => {
                navigate('/auth/verify-email')
            }, 1000)
        } catch (error) {
            logger.error('Error al registrar', error)
            handleError(error)
        }
    }


    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='w-full max-w-md'>

                <div className='card-purple rounded-2xl shadow-lg p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-semibold text-gray-800 mb-2'>
                            Crear cuenta
                        </h1>
                        <p className='text-gray-500 text-sm'>
                            Regístrate para comenzar
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                        <Input
                            type='email'
                            placeholder='Correo electrónico'
                            {...register('email')}
                            error={errors.email}
                            className="input-purple"
                        />

                        <Input
                            type='password'
                            placeholder='Contraseña'
                            {...register('password')}
                            error={errors.password}
                            className="input-purple"
                        />

                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            fullWidth
                            loadingText='Registrando...'
                            variant="purple"
                        >
                            Registrar
                        </Button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600'>
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to='/auth/login'
                                className='text-purple-500 hover:text-purple-600 font-medium transition-colors'
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
