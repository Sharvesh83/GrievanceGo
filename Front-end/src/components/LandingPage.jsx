import { useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Users, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LandingPage = () => {
    // const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const isAuthenticated = false; // Mocking as not authenticated initially on landing page

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-slate-50 relative overflow-hidden text-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-400/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            </div>

            {/* Navbar */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/40 bg-white/60 backdrop-blur-xl fixed w-full z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">GrievanceGo</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-500 items-center">
                    <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
                    <div className="flex gap-4 ml-2">
                        {!isAuthenticated && (
                            <Button variant="ghost" onClick={() => handleLogin('user')} className="hover:bg-slate-100 text-slate-600">Login</Button>
                        )}
                        {isAuthenticated ? (
                            <Button onClick={() => navigate('/dashboard')} className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800">Dashboard</Button>
                        ) : (
                            <Button onClick={() => navigate('/signup')} className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-blue-900/10">Get Started</Button>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </header>

            {/* Mobile Nav Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-[73px] bg-white/95 backdrop-blur-xl border-b p-4 md:hidden z-40 shadow-xl"
                    >
                        <nav className="flex flex-col gap-4">
                            <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
                            <a href="#how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>How it Works</a>
                            <div className="flex flex-col gap-2 pt-2 border-t">
                                {!isAuthenticated && (
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/login')}>Login</Button>
                                )}
                                {isAuthenticated && (
                                    <Button className="w-full bg-slate-900" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl space-y-8"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-sm font-semibold text-blue-700 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                        Rewriting Civic Engagement
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-1.1 text-slate-900">
                        Your Voice, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Empowered.</span><br />
                        Resolutions, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Tracked.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Connect directly with your representatives. Report issues, track progress, and build a better community together—all in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1" onClick={() => navigate('/signup')}>
                            <Users className="mr-2 h-5 w-5" />
                            Get Started
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white text-slate-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1" onClick={handleLogin}>
                            <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
                            Login
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Easy Reporting"
                        desc="File grievances in seconds with our intuitive interface. Attach photos and details effortlessly."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        color="bg-blue-100 text-blue-600"
                    />
                    <FeatureCard
                        title="Real-time Tracking"
                        desc="Stay updated. Watch your grievance move from 'Pending' to 'Resolved' in real-time."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        color="bg-emerald-100 text-emerald-600"
                    />
                    <FeatureCard
                        title="Official Dashboard"
                        desc="Dedicated tools for representatives to manage and resolve community issues efficiently."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>}
                        color="bg-purple-100 text-purple-600"
                    />
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 px-6 relative z-10 bg-white/40 backdrop-blur-md border-t border-white/50">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">How It Works</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        A simple, transparent process to get your issues resolved.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 -z-10"></div>

                    <StepCard
                        number="01"
                        title="Report"
                        desc="Log in and file a grievance. Upload photos and pin the location."
                        color="bg-blue-600"
                    />
                    <StepCard
                        number="02"
                        title="Track"
                        desc="Officials review your case. You receive real-time status updates."
                        color="bg-indigo-600"
                    />
                    <StepCard
                        number="03"
                        title="Resolve"
                        desc="The issue is fixed. Confirm the resolution and rate the service."
                        color="bg-purple-600"
                    />
                </div>
            </section>
        </div>
    )
}

const FeatureCard = ({ title, desc, icon, color }) => (
    <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group hover:-translate-y-2">
        <CardHeader className="p-8">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                {icon}
            </div>
            <CardTitle className="text-2xl font-bold mb-3 text-slate-800">{title}</CardTitle>
            <CardDescription className="text-base text-slate-500 leading-relaxed">{desc}</CardDescription>
        </CardHeader>
    </Card>
);

const StepCard = ({ number, title, desc, color }) => (
    <div className="flex flex-col items-center text-center group">
        <div className={`w-24 h-24 ${color} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20 mb-8 group-hover:scale-110 transition-transform border-4 border-white`}>
            {number}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed px-4">{desc}</p>
    </div>
);

export default LandingPage
