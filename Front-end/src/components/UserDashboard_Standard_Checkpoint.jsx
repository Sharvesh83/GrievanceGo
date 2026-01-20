import React, { useEffect, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { getinfo } from './Redux/actions';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, LogOut, Clock, CheckCircle } from "lucide-react";
import NewGrievanceModal from './NewGrievanceModal';
import GrievanceDetailsModal from './GrievanceDetailsModal';
import { motion } from 'framer-motion';
import { ShieldCheck } from "lucide-react";

const UserDashboard = () => {
    // const { user, logout, isAuthenticated } = useAuth0();
    const user = { name: "Test User", sub: "mock-id-123" };
    const isAuthenticated = true;
    const logout = () => window.location.href = "/";
    const dispatch = useDispatch();
    // const complaints = useSelector(state => state.info);
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
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            {/* Header / Hero */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-24 pt-10 px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user.name}</h1>
                        <p className="text-blue-100 mt-2">Here's what's happening with your grievances today.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-md font-semibold"
                        >
                            <Plus className="mr-2 h-4 w-4" /> File Grievance
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20 hover:text-white"
                            onClick={() => logout({ returnTo: window.location.origin })}
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 -mt-16 pb-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard title="Total" value={totalComplaints} icon={<Clock className="h-5 w-5 opacity-75" />} color="bg-white text-gray-900 border-l-4 border-blue-500" />
                    <StatsCard title="Pending" value={pendingComplaints} icon={<Clock className="h-5 w-5 opacity-75" />} color="bg-white text-yellow-700 border-l-4 border-yellow-500" />
                    <StatsCard title="In Progress" value={inProgressComplaints} icon={<Clock className="h-5 w-5 opacity-75" />} color="bg-white text-blue-700 border-l-4 border-blue-400" />
                    <StatsCard title="Resolved" value={resolvedComplaints} icon={<CheckCircle className="h-5 w-5 opacity-75" />} color="bg-white text-green-700 border-l-4 border-green-500" />
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                        {["All", "Pending", "In Progress", "Resolved"].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filterStatus === status
                                    ? "bg-blue-100 text-blue-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search grievances..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Newest">Newest First</option>
                            <option value="Oldest">Oldest First</option>
                        </select>
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
                        {filteredComplaints.map((item) => (
                            <motion.div key={item._id} variants={itemVariant}>
                                <Card className="relative hover:shadow-lg transition-all duration-300 border-t-4 border-t-transparent hover:border-t-blue-500 group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ShieldCheck className="w-24 h-24 text-primary transform rotate-12 -mr-8 -mt-8" />
                                    </div>
                                    <CardHeader className="pb-3 relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge status={item.status} />
                                            <span className="text-xs text-muted-foreground font-medium bg-secondary/50 px-2 py-1 rounded">
                                                {new Date(item.createdOn).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl line-clamp-1 group-hover:text-blue-600 transition-colors" title={item.subject}>
                                            {item.subject}
                                        </CardTitle>

                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <CardDescription className="line-clamp-2 mb-4 h-10">
                                            {item.description}
                                        </CardDescription>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-700">Department</p>
                                                <p>{item.department}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-700">Ward No</p>
                                                <p>{item.wardno}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2 relative z-10">
                                        <Button
                                            className="w-full bg-slate-900 text-white hover:bg-slate-800 group-hover:shadow-md transition-all"
                                            onClick={() => setSelectedGrievance(item)}
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed shadow-sm"
                    >
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <Plus className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No grievances found</h3>
                        <p className="text-gray-500 mt-1 mb-6 max-w-sm text-center">
                            {filterStatus === "All" && !searchTerm
                                ? "You haven't filed any grievances yet. Let's make your community better!"
                                : "No grievances match your current filters. Try adjusting them."}
                        </p>
                        {filterStatus === "All" && !searchTerm && (
                            <Button onClick={() => setIsModalOpen(true)}>File New Grievance</Button>
                        )}
                    </motion.div>
                )}
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

const StatsCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg shadow-sm ${color} flex flex-col items-start justify-between min-h-[100px] transition-transform hover:-translate-y-1 duration-300`}>
        <div className="flex w-full justify-between items-start mb-2">
            <h3 className="text-sm font-medium uppercase tracking-wider opacity-90">{title}</h3>
            {icon}
        </div>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const Badge = ({ status }) => {
    const styles = {
        'Resolved': 'bg-green-100 text-green-700 border-green-200',
        'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'In Progress': 'bg-blue-100 text-blue-700 border-blue-200'
    };

    const icons = {
        'Resolved': <CheckCircle className="w-3 h-3 mr-1" />,
        'Pending': <Clock className="w-3 h-3 mr-1" />,
        'In Progress': <Clock className="w-3 h-3 mr-1" />
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles['Pending']}`}>
            {icons[status]} {status}
        </span>
    );
};

export default UserDashboard
