import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import UserDashboard from './components/UserDashboard'
import OfficialDashboard from './components/OfficialDashboard'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/official" element={<OfficialDashboard />} />
        </Routes>
    )
}

export default App
