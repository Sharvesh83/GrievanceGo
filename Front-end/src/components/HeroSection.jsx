import React from 'react'
import { Link } from 'react-router-dom'
const HeroSection = () => {
    return (
        <div>
            <div className="w-[900px] font-['Poppins-ExtraBold'] text-[34px] font-extrabold text-[#3B64B6] pl-[4%] pt-[3%]">
                Transform your community by connecting citizens and authorities
                on one platform
            </div>
            <div className="w-[600px] font-['Poppins-SemiBold'] text-[16px] pt-[2.33%] pl-[4%]">
                Our platform is designed to transform communities by bringing
                citizens and authorities together in one place. By providing a
                space for open communication and collaboration, we aim to bridge
                the gap between the people and those in power.
            </div>
            <div className="pl-[4%] pt-[80px]">
                <Link to="/dashboard">
                    <button className="font-['Poppins-Bold'] bg-[#707EFF] text-white w-[247px] h-[65px] text-[22px] rounded-[7px] hover:bg-[#5b67d5] transition-colors">
                        Get Started Now
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default HeroSection
