import { Link } from "react-router-dom"

export const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>BIENVENIDO !</h1>

      <div>
        <div>Sistema de Autenticación</div>
        <div className='flex flex-row gap-4'>
          <Link to='/auth/login' className='text-blue-500 underline'>Iniciar sesión</Link>
          <Link to='/auth/register' className='text-blue-500 underline'>Registrarse</Link>
        </div>
      </div>
    </div>
  )
}
