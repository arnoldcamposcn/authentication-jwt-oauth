import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recoverPasswordSchema, RecoverPasswordData } from '../../../types/auth'
import { toast } from 'react-toastify'
import { authService } from '../../../api';
import { Link } from 'react-router-dom'
import { Input } from '../../atoms/Input'
import { EmailConfirmation } from '../../organisms/EmailConfirmation'
import { Button } from '../../atoms/Button'
import { handleError } from '../../../utils/errorHandler'
import { logger } from '../../../utils/logger'

export const FormRecoverPassword = () => {  
    const [emailSent, setEmailSent] = useState(false)
    const [userEmail, setUserEmail] = useState<string>('')

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RecoverPasswordData>({
        resolver: zodResolver(recoverPasswordSchema),
    })

    const onSubmit = async (data: RecoverPasswordData) => {
        try {
            await authService.forgotPassword(data.email)
            setUserEmail(data.email)
            reset()
            setEmailSent(true)
            toast.success('Correo de recuperación enviado')
        } catch (error) {
            logger.error('Error al recuperar contraseña', error)
            handleError(error)
        }
    }

    const handleResend = () => {
        setEmailSent(false)
    }


    if (emailSent) {
        return (
            <EmailConfirmation
                email={userEmail}
                onResend={handleResend}
            />
        )
    }


    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='w-full max-w-md'>

                <div className='card-purple rounded-2xl shadow-lg p-8'>

                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-semibold text-gray-800 mb-2'>
                            Recuperar contraseña
                        </h1>
                        <p className='text-gray-500 text-sm'>
                            Ingresa tu correo para recuperar tu contraseña
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

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            loadingText='Enviando correo de recuperación...'
                            fullWidth
                            variant="purple"
                        >
                            Enviar correo de recuperación
                        </Button>
                    </form>


                    <div className='mt-6 space-y-3 text-center'>
                        <p className='text-sm text-gray-600'>
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to='/auth/login'
                                className='text-purple-500 hover:text-purple-600 font-medium transition-colors'
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                        <p className='text-sm text-gray-600'>
                            ¿No tienes una cuenta?{' '}
                            <Link
                                to='/auth/register'
                                className='text-indigo-500 hover:text-indigo-600 font-medium transition-colors'
                            >
                                Registrarse
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}