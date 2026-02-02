import { Link } from 'react-router-dom'
import { Button } from '../atoms/Button'

interface EmailConfirmationProps {
  email: string
  onResend: () => void
  title?: string
  message?: string
  resendButtonText?: string
  backToLoginLink?: string
}

export const EmailConfirmation = ({
  email,
  onResend,
  title = 'Revisa tu correo electrónico',
  message = 'Hemos enviado un enlace de recuperación a:',
  resendButtonText = 'Enviar otro correo',
  backToLoginLink = '/auth/login',
}: EmailConfirmationProps) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4 px-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>

        <div className='mb-4'>
          <svg
            className='mx-auto h-16 w-16 text-green-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
        </div>

        <h2 className='text-2xl font-bold text-gray-800 mb-4'>
          {title}
        </h2>

        <p className='text-gray-600 mb-2'>
          {message}
        </p>

        <p className='text-blue-600 font-semibold mb-6 break-all'>
          {email}
        </p>

        <p className='text-gray-600 mb-6'>
          Haz clic en el enlace que recibiste por correo para restablecer tu contraseña.
        </p>

        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6'>
          <p className='text-sm text-yellow-800'>
            ⚠️ Si no recibes el correo, revisa tu carpeta de spam o intenta nuevamente.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <Button
            onClick={onResend}
            variant="primary"
            fullWidth
          >
            {resendButtonText}
          </Button>

          <Link
            to={backToLoginLink}
            className='text-blue-500 underline text-sm'
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}