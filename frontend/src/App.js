import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import EditorPage from './pages/EditorPage';
import OtpVerification from './components/OtpVerification';
import Profile from './pages/Profile';
import WorkspaceTabs from './components/WorkspaceTabs';

function App() {
  
  return (
    <>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/otp-verification' element={<OtpVerification/>}></Route>
            <Route path='/' element={<LoginPage/>}></Route>
            <Route path='/signup' element={<SignupPage/>}></Route>
            <Route path='/dashboard' element={<WorkspaceTabs/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/editor/:workspaceID' element={<EditorPage/>}></Route>
          </Routes>
        </Router>
    </> 
  )
}

export default App
