import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';
import OtpVerification from './components/OtpVerification';

function App() {
  
  return (
    <>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/otp-verification' element={<OtpVerification/>}></Route>
            <Route path='/' element={<LoginPage/>}></Route>
            <Route path='/signup' element={<SignupPage/>}></Route>
            <Route path='/dashboard' element={<Dashboard/>}></Route>
          </Routes>
        </Router>
    </> 
  )
}

export default App
