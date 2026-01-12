import React, { useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { getinfo } from './Redux/actions';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, LogOut, Clock, CheckCircle } from "lucide-react";
import NewGrievanceModal from './NewGrievanceModal';
import GrievanceDetailsModal from './GrievanceDetailsModal';
import { useState } from 'react';

const UserDashboard = () => {
    const { user, logout, isAuthenticated } = useAuth0();
    const dispatch = useDispatch();
    const complaints = useSelector(state => state.info);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);

    useEffect(() => {
        if (user?.sub) {
            dispatch(getinfo(user.sub));
        }
    }, [dispatch, user]);

    if (!isAuthenticated) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-secondary/20 p-8 font-sans">
            <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
                    <p className="text-muted-foreground">Manage your filed grievances and track their status.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> File New Grievance
                    </Button>
                    <Button variant="outline" onClick={() => logout({ returnTo: window.location.origin })}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto grid gap-6">
                {complaints && complaints.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {complaints.map((item) => (
                            <Card key={item._id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg line-clamp-1" title={item.subject}>{item.subject}</CardTitle>
                                        {item.status === 'Resolved' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock className="w-3 h-3 mr-1" /> Pending
                                            </span>
                                        )}
                                    </div>
                                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p><span className="font-semibold">Ward:</span> {item.wardno}</p>
                                        <p><span className="font-semibold">Date:</span> {new Date(item.createdOn).toLocaleDateString()}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <Button variant="secondary" className="w-full text-xs h-8" onClick={() => setSelectedGrievance(item)}>
                                        View Status & Chat
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16 border-dashed">
                        <CardContent>
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">No grievances found</h3>
                            <p className="text-muted-foreground mb-4">You haven't filed any grievances yet.</p>
                            <Button onClick={() => setIsModalOpen(true)}>File your first one</Button>
                        </CardContent>
                    </Card>
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

export default UserDashboard
