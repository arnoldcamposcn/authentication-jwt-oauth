import { LogoutButton } from "../components/molecules/LogoutButton";
export const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div>
          <h2 className='text-2xl font-bold'>Bienvenido al dashboard</h2>
          <p className='text-gray-500'>Aquí puedes ver tus datos</p>
        </div>
        <LogoutButton />
      </div>
    </>
  )
}
