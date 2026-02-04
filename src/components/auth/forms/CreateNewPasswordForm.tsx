import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNewPasswordSchema, CreateNewPasswordData } from '../../../types/auth'
import { toast } from 'react-toastify'
import { authService } from '../../../api';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '../../atoms/Input'
import { Button } from '../../atoms/Button';
import { handleError } from '../../../utils/errorHandler'
import { logger } from '../../../utils/logger'

export const FormCreateNewPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateNewPasswordData>({
    resolver: zodResolver(createNewPasswordSchema)
  })

  const onSubmit = async (data: CreateNewPasswordData) => {
    if (!token) {
      toast.error('Token inválido o expirado')
      return
    }

    try {
      await authService.createNewPassword({
        token,
        password: data.password,
      })

      reset()
      toast.success('Contraseña actualizada correctamente')

      setTimeout(() => {
        navigate('/auth/login')
      }, 1000)
    } catch (error) {
      logger.error('Error al actualizar contraseña', error)
      handleError(error)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>

        <div className='card-purple rounded-2xl shadow-lg p-8'>

          <div className='text-center mb-8'>
            <h1 className='text-3xl font-semibold text-gray-800 mb-2'>
              Nueva contraseña
            </h1>
            <p className='text-gray-500 text-sm'>
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <Input
              type='password'
              placeholder='Nueva contraseña'
              {...register('password')}
              error={errors.password}
              className="input-purple"
            />

            <Input
              type='password'
              placeholder='Confirmar contraseña'
              {...register('confirmPassword')}
              error={errors.confirmPassword}
              className="input-purple"
            />

            <Button
              type='submit'
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingText='Actualizando...'
              fullWidth
              variant="purple"
            >
              Actualizar contraseña
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
