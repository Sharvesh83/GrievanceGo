import React, { useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { getinfo, resolveComplaint } from './Redux/actions';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, MessageSquare, Clock } from "lucide-react";
import { useState } from 'react';
import GrievanceDetailsModal from './GrievanceDetailsModal';

const OfficialDashboard = () => {
    const { user, logout, isAuthenticated } = useAuth0();
    const dispatch = useDispatch();
    const complaints = useSelector(state => state.info);
    const [selectedGrievance, setSelectedGrievance] = useState(null);

    useEffect(() => {
        // Fetch ALL grievances (no userId filter)
        dispatch(getinfo());
    }, [dispatch]);

    const handleResolve = (id) => {
        dispatch(resolveComplaint(id));
        // Optimistic update or refetch could happen here, Redux action handles dispatch
        setTimeout(() => dispatch(getinfo()), 500); // clear refresh for demo
    }

    if (!isAuthenticated) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Official Dashboard</h1>
                    <p className="text-slate-500">Overview of all community grievances.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        {complaints?.filter(c => c.status !== 'Resolved').length} Active Cases
                    </div>
                    <Button variant="outline" onClick={() => logout({ returnTo: window.location.origin })}>
                        Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* Kanban-style or Grid View */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints && complaints.map((item) => (
                        <Card key={item._id} className={`hover:shadow-lg transition-all border-l-4 ${item.status === 'Resolved' ? 'border-l-green-500 opacity-75' : 'border-l-yellow-500'}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg leading-tight">{item.subject}</CardTitle>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ward {item.wardno} • {item.department}</span>
                                    </div>
                                    {item.status === 'Resolved' ? (
                                        <div className="bg-green-100 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-green-700" /></div>
                                    ) : (
                                        <div className="bg-yellow-100 p-1 rounded-full"><Clock className="w-4 h-4 text-yellow-700" /></div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-4">{item.description}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>By: {item.name}</span>
                                    <span>•</span>
                                    <span>{new Date(item.createdOn).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between gap-2">
                                <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelectedGrievance(item)}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> Chat ({item.chats?.length || 0})
                                </Button>
                                {item.status !== 'Resolved' && (
                                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleResolve(item._id)}>
                                        Mark Resolved
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <GrievanceDetailsModal
                    isOpen={!!selectedGrievance}
                    onClose={() => setSelectedGrievance(null)}
                    grievance={selectedGrievance}
                    currentUserRole="official"
                />
            </main>
        </div>
    )
}

export default OfficialDashboard
