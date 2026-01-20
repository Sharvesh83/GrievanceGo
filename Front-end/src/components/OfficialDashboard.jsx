import React, { useEffect, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { getinfo, resolveComplaint } from './Redux/actions';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, MessageSquare, Clock, ShieldCheck, LogOut, Filter, Smartphone, Map, Activity, Menu, Sun, Moon, Search, Home, PieChart, Bell, Settings, User } from "lucide-react";
import GrievanceDetailsModal from './GrievanceDetailsModal';
import { motion } from 'framer-motion';

const OfficialDashboard = () => {
    const user = { name: "Official Admin", email: "admin@grievancego.com", sub: "mock-official-id", role: "official" };
    const isAuthenticated = true;
    const logout = () => window.location.href = "/";
    const dispatch = useDispatch();

    const [complaints, setComplaints] = useState([
        {
            _id: "1",
            subject: "Potholes on Main Street",
            description: "Deep potholes causing traffic issues near the market.",
            status: "Pending",
            wardno: "12",
            createdOn: new Date().toISOString(),
            department: "Roads",
            name: "Rahul Kumar",
            chats: ["[OFFICIAL]: We are looking into it.", "When will this be fixed?"]
        },
        {
            _id: "2",
            subject: "Garbage not collected",
            description: "Garbage truck hasn't come for 3 days.",
            status: "Resolved",
            wardno: "05",
            createdOn: "2023-10-15T10:00:00Z",
            department: "Sanitation",
            name: "Anita Singh",
            chats: []
        },
        {
            _id: "3",
            subject: "Street Light Broken",
            description: "Street light flickering constantly on 5th Avenue.",
            status: "In Progress",
            wardno: "08",
            createdOn: "2023-11-20T14:30:00Z",
            department: "Electrical",
            name: "Vijay P",
            chats: []
        },
        {
            _id: "4",
            subject: "Water Leakage",
            description: "Main pipe burst in 2nd Cross Street.",
            status: "Pending",
            wardno: "10",
            createdOn: "2023-12-01T08:00:00Z",
            department: "Water Supply",
            name: "Suresh K",
            chats: []
        }
    ]);

    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    const [searchTerm, setSearchTerm] = useState("");

    // Statistics
    const totalComplaints = complaints.length;
    const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

    const filteredComplaints = complaints
        .filter(item => {
            const matchesStatus = filterStatus === "All" || item.status === filterStatus;
            const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });

    const handleResolve = (id, e) => {
        e.stopPropagation(); // Prevent opening modal when clicking resolve
        console.log("Resolving case:", id);
        setComplaints(prev => prev.map(c =>
            c._id === id ? { ...c, status: 'Resolved' } : c
        ));
    }

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={`flex min-h-screen font-sans transition-colors duration-300 overflow-hidden ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-emerald-50/30 text-slate-900'}`}>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-400/20'}`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse delay-700 ${darkMode ? 'bg-teal-900/20' : 'bg-teal-400/20'}`}></div>
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '260px' : '80px' }}
                className={`backdrop-blur-xl border-r shadow-2xl z-20 hidden md:flex flex-col relative transition-colors duration-300 ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/70 border-white/50'}`}
            >
                <div className={`h-20 flex items-center justify-center border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                            >
                                Official Portal
                            </motion.span>
                        )}
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    <SidebarItem icon={<Home />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} isOpen={isSidebarOpen} darkMode={darkMode} />
                    <SidebarItem icon={<PieChart />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} isOpen={isSidebarOpen} darkMode={darkMode} />
                    <SidebarItem icon={<Bell />} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} isOpen={isSidebarOpen} badge="5" darkMode={darkMode} />
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
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                            OA
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
                                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Dashboard Overview</h1>
                                    <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and resolve community grievances efficiently.</p>
                                </div>
                            </header>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                <ModernStatCard title="Total Grievances" value={totalComplaints} icon={<Activity />} color={darkMode ? "bg-slate-800/60 text-slate-200" : "bg-white/60 text-slate-900"} darkMode={darkMode} border="border-l-4 border-blue-500" />
                                <ModernStatCard title="Active Cases" value={activeComplaints} icon={<Clock />} color={darkMode ? "bg-amber-900/20 text-amber-200" : "bg-amber-50/60 text-amber-700"} darkMode={darkMode} border="border-l-4 border-amber-500" />
                                <ModernStatCard title="Resolved Cases" value={resolvedComplaints} icon={<CheckCircle />} color={darkMode ? "bg-emerald-900/20 text-emerald-200" : "bg-emerald-50/60 text-emerald-700"} darkMode={darkMode} border="border-l-4 border-emerald-500" />
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
                                        placeholder="Search grievances..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border-transparent rounded-xl text-sm transition-all outline-none focus:ring-2 ${darkMode ? 'bg-slate-900 text-slate-200 focus:bg-slate-800 focus:ring-emerald-500/50' : 'bg-slate-50 text-slate-900 focus:bg-white focus:ring-emerald-100'}`}
                                    />
                                </div>
                            </div>

                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredComplaints.length > 0 ? filteredComplaints.map((item) => (
                                    <motion.div key={item._id} variants={itemVariant}>
                                        <div
                                            onClick={() => setSelectedGrievance(item)}
                                            className={`group backdrop-blur-md border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col h-full ${darkMode ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800/80' : 'bg-white/60 border-white/60 hover:bg-white/80'}`}
                                        >
                                            {/* Colored Border Accent */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                                            <div className="flex justify-between items-start mb-3 pl-3">
                                                <Badge status={item.status} darkMode={darkMode} />
                                                <span className="text-xs font-semibold text-slate-400">{new Date(item.createdOn).toLocaleDateString()}</span>
                                            </div>

                                            <div className="pl-3 mb-4 flex-grow">
                                                <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors line-clamp-1 ${darkMode ? 'text-slate-100 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>
                                                    {item.subject}
                                                </h3>
                                                <p className={`text-sm line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="pl-3 mt-auto">
                                                <div className={`flex items-center gap-2 text-xs mb-4 p-2 rounded-lg ${darkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                                                    <Smartphone className="w-3 h-3" />
                                                    <span className="font-semibold">Filed by:</span> {item.name}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`flex-1 hover:text-emerald-600 ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-2" /> Chat
                                                    </Button>
                                                    {item.status !== 'Resolved' && (
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                                                            onClick={(e) => handleResolve(item._id, e)}
                                                        >
                                                            Quick Resolve
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-70">
                                        <Search className={`w-12 h-12 mb-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                        <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>No grievances found.</p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}

                    {(activeTab === 'Analytics' || activeTab === 'Notifications' || activeTab === 'Settings') && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Coming Soon</h3>
                            <p className="text-slate-500">This feature is under development.</p>
                        </div>
                    )}

                </div>
            </main>

            <GrievanceDetailsModal
                isOpen={!!selectedGrievance}
                onClose={() => setSelectedGrievance(null)}
                grievance={selectedGrievance}
                currentUserRole="official"
            />
        </div>
    )
}

const SidebarItem = ({ icon, label, active, onClick, isOpen, badge, darkMode }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active
                ? (darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
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

const ModernStatCard = ({ title, value, icon, color, darkMode, border }) => (
    <div className={`backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${color} ${border}`}>
        <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium uppercase tracking-wider opacity-80`}>{title}</p>
            <div className="opacity-70">{icon}</div>
        </div>
        <h2 className="text-3xl font-extrabold">{value}</h2>
    </div>
);

const Badge = ({ status, darkMode }) => {
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

export default OfficialDashboard
