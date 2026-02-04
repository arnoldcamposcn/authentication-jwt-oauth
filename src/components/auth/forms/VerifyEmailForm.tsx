import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VerifyEmailData, verifyEmailSchema } from '../../../types/auth'
import { toast } from 'react-toastify'
import { authService } from '../../../api';
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../atoms/Input'
import { Button } from '../../atoms/Button';
import { handleError } from '../../../utils/errorHandler'
import { logger } from '../../../utils/logger'
import { setAccessToken } from '../../../api/axios.instance';
import { useEffect, useState } from 'react';

export const FormVerifyEmail = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [isResending, setIsResending] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<VerifyEmailData>({
        resolver: zodResolver(verifyEmailSchema)
    })

    useEffect(() => {
        const storedEmail = localStorage.getItem('pendingVerificationEmail') || '';

        if (storedEmail) {
            setEmail(storedEmail);
            setValue('email', storedEmail);
        } else {
            toast.error('No se encontró email pendiente de verificación');
            navigate('/auth/register');
        }
    }, [setValue, navigate]);


    const onSubmit = async (data: VerifyEmailData) => {
        try {
            const response = await authService.verifyEmail({
                email: data.email,
                code: data.code
            });

            logger.log('Token guardado en memoria:', response.accessToken);
            setAccessToken(response.accessToken);

            localStorage.removeItem('pendingVerificationEmail');

            reset();
            toast.success('Correo electrónico verificado');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            logger.error('Error al verificar correo electrónico', error);
            handleError(error);
        }
    }

    const handleResendCode = async () => {
        if (!email) {
            toast.error('No se encontró email para reenviar');
            return;
        }

        setIsResending(true);
        try {
            await authService.resendVerificationEmail(email);
            toast.success('Código de verificación reenviado. Revisa tu correo electrónico.');
            logger.log('Código de verificación reenviado a:', email);
        } catch (error) {
            logger.error('Error al reenviar código de verificación', error);
            handleError(error);
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='w-full max-w-md'>

                <div className='card-purple rounded-2xl shadow-lg p-8'>
                <div className='text-center mb-8'>
                        <h1 className='text-3xl font-semibold text-gray-800 mb-2'>
                            Verificar correo electrónico
                        </h1>
                        <p className='text-gray-500 text-sm'>
                            Verifica tu correo electrónico para continuar
                        </p>
                        {email && (
                            <p className='text-sm text-gray-600 mt-2'>
                                Código enviado a: <span className='font-semibold text-purple-600'>{email}</span>
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

                    <Input
                        type='text'
                        placeholder='Código de verificación'
                        maxLength={6}
                        inputMode='numeric'
                        pattern='[0-9]*'
                        {...register('code')}
                        error={errors.code}
                        className="input-purple"
                    />  

                    <input type='hidden' {...register('email')} />

                    <Button
                            type='submit'
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            fullWidth
                            loadingText='Verificando...'
                            variant="purple"
                        >
                            Verificar
                        </Button>
                    </form>

                    <div className='mt-6 space-y-3'>
                        <div className='text-center'>
                            <button
                                type='button'
                                onClick={handleResendCode}
                                disabled={isResending || !email}
                                className='text-sm text-purple-500 hover:text-purple-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isResending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                            </button>
                        </div>

                        <div className='text-center'>
                            <p className='text-sm text-gray-600'>
                                Volver a la{' '}
                                <Link 
                                    to='/' 
                                    className='text-purple-500 hover:text-purple-600 font-medium transition-colors'
                                >
                                    página de inicio
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
