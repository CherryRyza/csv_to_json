import './App.css'

// Page
import Index from './index'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';

// React Router Dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
        <Router>
            <Routes>
              <Route index element={<Index />} />
              <Route path="/index" element={<Index/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/register" element={<RegisterPage/>} />
              <Route path="/home" element={<HomePage/>} />
            </Routes>
        </Router>
  )
}

export default App
