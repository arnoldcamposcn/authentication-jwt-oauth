import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginData } from '../../../types/auth'
import { toast } from 'react-toastify'
import { authService } from '../../../api'
import { setAccessToken } from '../../../api/axios.instance'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Input } from '../../atoms/Input'
import { Button } from '../../atoms/Button'
import { handleError } from '../../../utils/errorHandler'
import { logger } from '../../../utils/logger'
import { GoogleAuthButton } from '../../atoms/GoogleAuthButton'


export const FormLogin = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginData) => {
        try {
            const response = await authService.login(data)
            setAccessToken(response.accessToken)
            logger.log('Token guardado en memoria:', response.accessToken)

            reset()
            toast.success('Inicio de sesión exitoso')

            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)
        } catch (error) {
            logger.error('Error al iniciar sesión', error)
            handleError(error)
        }
    }

    return (
        <>
            <div className='min-h-screen flex items-center justify-center px-4'>
                <div className='w-full max-w-md'>

                    <div className='card-purple rounded-2xl shadow-lg p-8'>

                        <div className='text-center mb-8'>
                            <h1 className='text-3xl font-semibold text-gray-800 mb-2'>
                                Bienvenido
                            </h1>
                            <p className='text-gray-500 text-sm'>
                                Inicia sesión en tu cuenta
                            </p>
                        </div>


                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                            <Input
                                type="email"
                                placeholder="Correo electrónico"
                                {...register('email')}
                                error={errors.email}
                                className="input-purple"
                            />

                            <Input
                                type="password"
                                placeholder="Contraseña"
                                {...register('password')}
                                error={errors.password}
                                className="input-purple"
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                fullWidth
                                loadingText='Iniciando sesión...'
                                variant="purple"
                            >
                                Iniciar sesión
                            </Button>
                        </form>


                        <div className="my-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">O</span>
                                </div>
                            </div>
                        </div>


                        <GoogleAuthButton />


                        <div className='mt-6 space-y-3 text-center'>
                            <p className='text-sm text-gray-600'>
                                ¿No tienes una cuenta?{' '}
                                <Link
                                    to='/auth/register'
                                    className='text-purple-500 hover:text-purple-600 font-medium transition-colors'
                                >
                                    Registrarse
                                </Link>
                            </p>
                            <p className='text-sm text-gray-600'>
                                ¿Olvidaste tu contraseña?{' '}
                                <Link
                                    to='/auth/recover-password'
                                    className='text-indigo-500 hover:text-indigo-600 font-medium transition-colors'
                                >
                                    Recuperar contraseña
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
