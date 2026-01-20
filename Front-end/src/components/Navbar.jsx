import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'

function Navbar({ onRegisterNewClick }) {
    return (
        <div className="w-full h-[160px] flex justify-between items-center px-[50px] pr-[85px]">
            <Link to="/">
                <img
                    style={{ height: '57.12px', width: '241px' }}
                    src={Logo}
                    alt="logo-img"
                />
            </Link>
            <button
                className="w-[265px] h-[45px] bg-[#9685F2] rounded-[7px] text-white font-medium text-[18px] hover:bg-[#8070e0] transition-colors font-['Roboto']"
                onClick={onRegisterNewClick}
            >
                Register New Complaint
            </button>
        </div>
    )
}

export default Navbar
