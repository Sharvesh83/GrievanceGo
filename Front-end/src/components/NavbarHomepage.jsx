import Logo from '../assets/logo.png'
// import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

function NavbarHomepage() {
    // const { loginWithRedirect } = useAuth0()
    const navigate = useNavigate()
    return (
        <div className="pt-[3.83%] px-[4%] h-[160px] w-screen flex justify-between">
            <img
                style={{ height: '57.12px', width: '241px' }}
                src={Logo}
                alt="logo-img"
            />
            <div className="flex gap-4 items-center">
                <button
                    onClick={() => navigate('/official')}
                    className="font-['Roboto-Medium'] text-[16px] text-[#707EFF] hover:text-[#5b67d5] transition-colors"
                >
                    Official Login
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="font-['Roboto-Black'] text-[20px] w-[138px] h-[58px] bg-[#707EFF] rounded-[7px] text-white hover:bg-[#5b67d5] transition-colors"
                >
                    Sign In
                </button>
            </div>
        </div>
    )
}

export default NavbarHomepage
