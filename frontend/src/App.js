import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  
  return (
    <>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/signup' element={<SignupPage/>}></Route>
            <Route path='/dashboard' element={<Dashboard/>}></Route>
          </Routes>
        </Router>
    </> 
  )
}

export default App
