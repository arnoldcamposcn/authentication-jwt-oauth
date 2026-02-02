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


export const FormLogin = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginData) => {

        try {
            const response = await authService.login(data)
            setAccessToken(response.accessToken)
            console.log('Token guardado en memoria:', response.accessToken)

            reset()
            toast.success('Inicio de sesión exitoso')

            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)
        }

        catch (error) {
            console.error('Error al iniciar sesión', error)
            toast.error('Error al iniciar sesión')
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
                                className="btn-purple-gradient"
                            >
                                Iniciar sesión
                            </Button>
                        </form>


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
