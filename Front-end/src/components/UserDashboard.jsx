import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import api from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, LogOut, Clock, CheckCircle, ShieldCheck, Search, Filter, Home, PieChart, Settings, Bell, Menu, Moon, Sun, User, Mail, Phone, MapPin, Save } from "lucide-react";
import NewGrievanceModal from './NewGrievanceModal';
import GrievanceDetailsModal from './GrievanceDetailsModal';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user: auth0User, isAuthenticated: isAuth0Authenticated, logout: auth0Logout, isLoading: auth0Loading, getAccessTokenSilently } = useAuth0();

    // Local Auth State
    const [localUser, setLocalUser] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: "User", email: "", phone: "", address: "" });
    const isLocalAuthenticated = !!localStorage.getItem('token');

    // Combined State
    const isAuthenticated = isLocalAuthenticated || isAuth0Authenticated;
    const user = isAuth0Authenticated ? { ...auth0User, phone: "", address: "" } : localUser;

    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        if (isAuth0Authenticated) {
            auth0Logout({ logoutParams: { returnTo: window.location.origin } });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    useEffect(() => {
        const fetchGrievances = async () => {
            try {
                let token = localStorage.getItem('token');

                if (isAuth0Authenticated) {
                    try {
                        const auth0Token = await getAccessTokenSilently();
                        if (auth0Token) token = auth0Token;
                    } catch (error) {
                        console.error("Auth0 Token Error:", error);
                    }
                }

                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await api.get('/user-grievances', config);
                setComplaints(res.data);
            } catch (err) {
                console.error("Failed to fetch grievances", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) fetchGrievances();
        else setIsLoading(false);

    }, [isAuthenticated, isAuth0Authenticated, getAccessTokenSilently]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");

    // Profile State
    const [profile, setProfile] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        alert("Profile updated! (Mock Logic)");
    };

    // Filter & Sort State
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortOrder, setSortOrder] = useState("Newest");
    const [searchTerm, setSearchTerm] = useState("");

    // Statistics
    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;

    // Derived Data
    const filteredComplaints = complaints
        .filter(item => {
            const matchesStatus = filterStatus === "All" || item.status === filterStatus;
            const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdOn);
            const dateB = new Date(b.createdOn);
            return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
        });

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div className={`flex min-h-screen font-sans transition-colors duration-300 overflow-hidden ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse ${darkMode ? 'bg-blue-900/20' : 'bg-blue-400/20'}`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse delay-700 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-400/20'}`}></div>
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '260px' : '80px' }}
                className={`backdrop-blur-xl border-r shadow-2xl z-20 hidden md:flex flex-col relative transition-colors duration-300 ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/70 border-white/50'}`}
            >
                <div className={`h-20 flex items-center justify-center border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
                            >
                                GrievanceGo
                            </motion.span>
                        )}
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    <SidebarItem icon={<Home />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} darkMode={darkMode} />
                    <SidebarItem icon={<PieChart />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} isOpen={isSidebarOpen} darkMode={darkMode} />
                    <SidebarItem icon={<Bell />} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} isOpen={isSidebarOpen} badge="3" darkMode={darkMode} />
                    <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isOpen={isSidebarOpen} darkMode={darkMode} />
                </div>

                <div className={`p-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button
                        onClick={toggleDarkMode}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'} ${!isSidebarOpen && 'justify-center'}`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {isSidebarOpen && <span className="font-medium text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>

                    <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-100/50 hover:bg-slate-100'} ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{user.name}</p>
                                <p className="text-xs text-slate-500 truncate cursor-pointer hover:text-red-500" onClick={() => logout()}>Log out</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`absolute top-1/2 -right-3 w-6 h-6 border rounded-full flex items-center justify-center shadow-md transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                >
                    <Menu className="w-3 h-3" />
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto z-10 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-6 py-10">

                    {activeTab === 'Overview' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            {/* Header */}
                            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                                <div>
                                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Hello, {user.name} 👋</h1>
                                    <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Here's what's happening with your reported cases.</p>
                                </div>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
                                >
                                    <Plus className="mr-2 h-5 w-5" /> File New Grievance
                                </Button>
                            </header>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                <ModernStatCard title="Total" value={totalComplaints} color={darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"} darkMode={darkMode} />
                                <ModernStatCard title="Pending" value={pendingComplaints} color={darkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-600"} darkMode={darkMode} />
                                <ModernStatCard title="In Progress" value={inProgressComplaints} color={darkMode ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-50 text-indigo-600"} darkMode={darkMode} />
                                <ModernStatCard title="Resolved" value={resolvedComplaints} color={darkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600"} darkMode={darkMode} />
                            </div>

                            {/* Filter Bar */}
                            <div className={`backdrop-blur-md rounded-2xl p-2 shadow-sm border mb-8 flex flex-col md:flex-row justify-between gap-4 transition-colors ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-white/50'}`}>
                                <div className="flex gap-1 p-1 rounded-xl overflow-x-auto">
                                    {["All", "Pending", "In Progress", "Resolved"].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${filterStatus === status
                                                ? (darkMode ? "bg-slate-700 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm")
                                                : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-72 pr-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search cases..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border-transparent rounded-xl text-sm transition-all outline-none focus:ring-2 ${darkMode ? 'bg-slate-900 text-slate-200 focus:bg-slate-800 focus:ring-blue-500/50' : 'bg-slate-50 text-slate-900 focus:bg-white focus:ring-blue-100'}`}
                                    />
                                </div>
                            </div>

                            {/* Grid */}
                            {filteredComplaints.length > 0 ? (
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredComplaints.map(item => (
                                        <motion.div key={item._id} variants={itemVariant}>
                                            <div
                                                onClick={() => setSelectedGrievance(item)}
                                                className={`group backdrop-blur-md border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800/80' : 'bg-white/60 border-white/60 hover:bg-white/80'}`}
                                            >
                                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 ${darkMode ? 'from-blue-500/10 to-transparent' : 'from-blue-100/50 to-transparent'}`}></div>

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <ModernBadge status={item.status} darkMode={darkMode} />
                                                        <span className="text-xs font-semibold text-slate-400">{new Date(item.createdOn).toLocaleDateString()}</span>
                                                    </div>

                                                    <h3 className={`text-xl font-bold mb-2 leading-tight transition-colors ${darkMode ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>{item.subject}</h3>
                                                    <p className={`text-sm line-clamp-2 mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>

                                                    <div className="flex items-center gap-3">
                                                        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                            {item.department}
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                            Ward {item.wardno}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <Search className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>No grievances found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your filters or create a new one.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'Settings' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
                            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Profile Settings</h2>
                            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white/60'}`}>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border cursor-not-allowed opacity-70 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={profile.address}
                                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-500/20">
                                            <Save className="w-4 h-4 mr-2" /> Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {(activeTab === 'Analytics' || activeTab === 'Notifications') && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Coming Soon</h3>
                            <p className="text-slate-500">This feature is under development.</p>
                        </div>
                    )}
                </div>
            </main>

            <NewGrievanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <GrievanceDetailsModal
                isOpen={!!selectedGrievance}
                onClose={() => setSelectedGrievance(null)}
                grievance={selectedGrievance}
                currentUserRole="user"
            />
        </div>
    )
}

const SidebarItem = ({ icon, label, active, onClick, isOpen, badge, darkMode }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active
            ? (darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')
            : (darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
            } ${!isOpen && 'justify-center'}`}
    >
        <div className="w-5 h-5">{icon}</div>
        {isOpen && (
            <div className="flex-1 flex justify-between items-center">
                <span className="font-medium text-sm">{label}</span>
                {badge && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{badge}</span>}
            </div>
        )}
    </div>
);

const ModernStatCard = ({ title, value, color, darkMode }) => (
    <div className={`backdrop-blur-sm border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white/60'}`}>
        <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <div className="flex items-center gap-3">
            <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{value}</h2>
            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${color}`}>+12%</div>
        </div>
    </div>
);

const ModernBadge = ({ status, darkMode }) => {
    const styles = {
        'Resolved': darkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
        'Pending': darkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700',
        'In Progress': darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${styles[status]}`}>
            {status}
        </span>
    );
};

export default UserDashboard
