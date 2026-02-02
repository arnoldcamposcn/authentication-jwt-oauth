import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './routes/AppRoutes';


function App() {

  return (
    <div className='min-h-screen bg-purple-gradient'>
      <ToastContainer 
        position='top-right' 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='light'
      />
      <AppRoutes/>
    </div>
  );
}

export default App;