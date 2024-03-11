import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import EditorPage from './pages/EditorPage';
import OtpVerification from './components/OtpVerification';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

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
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/editor/:workspaceID/:folderID/:fileID' element={<EditorPage/>}></Route>
            <Route path='/editor/:workspaceID/:folderID' element={<EditorPage/>}></Route>
            <Route path='/editor/:workspaceID' element={<EditorPage/>}></Route>
          </Routes>
        </Router>
    </> 
  )
}

export default App
