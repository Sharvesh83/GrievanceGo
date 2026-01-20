import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import UserDashboard from './components/UserDashboard'
import OfficialDashboard from './components/OfficialDashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import RequireAuth from './components/RequireAuth'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
                <RequireAuth>
                    <UserDashboard />
                </RequireAuth>
            } />
            <Route path="/official" element={
                <RequireAuth>
                    <OfficialDashboard />
                </RequireAuth>
            } />
        </Routes>
    )
}

export default App
