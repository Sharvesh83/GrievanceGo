import React, { useEffect, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { getinfo } from './Redux/actions';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, LogOut, Clock, CheckCircle, ShieldCheck, Search, Filter, ArrowUpRight, LayoutGrid, List } from "lucide-react";
import NewGrievanceModal from './NewGrievanceModal';
import GrievanceDetailsModal from './GrievanceDetailsModal';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    // const { user, logout, isAuthenticated } = useAuth0();
    const user = { name: "Test User", sub: "mock-id-123" };
    const isAuthenticated = true;
    const logout = () => window.location.href = "/";
    const dispatch = useDispatch();

    const complaints = [
        {
            _id: "1",
            subject: "Potholes on Main Street",
            description: "Deep potholes causing traffic issues near the market.",
            status: "Pending",
            wardno: "12",
            createdOn: new Date().toISOString(),
            department: "Roads",
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
            chats: []
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);

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

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900">
            {/* Subtle Grid Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none z-0"></div>
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #e4e4e7 1px, transparent 0)',
                backgroundSize: '24px 24px'
            }}></div>

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="font-semibold tracking-tight text-lg">GrievanceGo</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500 hidden sm:inline-block">Signed in as <span className="font-medium text-zinc-900">{user.name}</span></span>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => logout({ returnTo: window.location.origin })}
                            className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold tracking-tight text-zinc-900"
                        >
                            Overview
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-500 mt-2 text-lg"
                        >
                            Track, manage, and resolve your community grievances.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-5 py-6 shadow-sm hover:shadow-md transition-all font-medium"
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Grievance
                        </Button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                >
                    <StatsCard title="Total Cases" value={totalComplaints} />
                    <StatsCard title="Pending" value={pendingComplaints} />
                    <StatsCard title="In Progress" value={inProgressComplaints} />
                    <StatsCard title="Resolved" value={resolvedComplaints} />
                </motion.div>

                {/* Filters & Content Area */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm">
                        <div className="flex gap-1 bg-zinc-100/50 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                            {["All", "Pending", "In Progress", "Resolved"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${filterStatus === status
                                        ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                                        : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 w-full md:w-auto items-center">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-transparent border-0 ring-1 ring-zinc-200 focus:ring-2 focus:ring-zinc-900 rounded-lg text-sm w-full transition-all placeholder:text-zinc-400"
                                />
                            </div>
                        </div>
                    </div>

                    {filteredComplaints.length > 0 ? (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredComplaints.map((item) => (
                                <motion.div key={item._id} variants={itemVariant}>
                                    <div
                                        onClick={() => setSelectedGrievance(item)}
                                        className="group relative bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge status={item.status} />
                                            <span className="text-xs font-mono text-zinc-400">{new Date(item.createdOn).toLocaleDateString()}</span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-zinc-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {item.subject}
                                        </h3>

                                        <p className="text-sm text-zinc-500 line-clamp-2 mb-6 flex-grow leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">Department</span>
                                                <span className="text-xs font-medium text-zinc-700">{item.department}</span>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50"
                        >
                            <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900">No grievances found</h3>
                            <p className="text-zinc-500 max-w-sm text-center mt-2 mb-6">
                                We couldn't find any complaints matching your filters. Try adjusting your search or create a new one.
                            </p>
                            {filterStatus === "All" && !searchTerm && (
                                <Button onClick={() => setIsModalOpen(true)} variant="outline">
                                    Create New Case
                                </Button>
                            )}
                        </motion.div>
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

const StatsCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
        <span className="text-sm font-medium text-zinc-500 mb-1">{title}</span>
        <span className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</span>
    </div>
);

const Badge = ({ status }) => {
    const styles = {
        'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-200'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['Pending']}`}>
            {status}
        </span>
    );
};

export default UserDashboard
