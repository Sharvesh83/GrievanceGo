import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addingchat, getinfo } from './Redux/actions';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, MapPin, Calendar, Tag, ShieldCheck, User, Image as ImageIcon, CheckCircle, Navigation } from "lucide-react";
import Confetti from 'react-confetti';

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useEffect(() => {
        function handleResize() {
            setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowDimensions;
};

const GrievanceDetailsModal = ({ isOpen, onClose, grievance, currentUserRole = 'user' }) => {
    const [message, setMessage] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowDimensions();
    const dispatch = useDispatch();

    // Reset confetti when modal opens/closes
    useEffect(() => {
        if (!isOpen) setShowConfetti(false);
    }, [isOpen]);

    if (!grievance) return null;

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const chatData = {
            sender: currentUserRole === 'official' ? 'Official' : 'User',
            message: message,
            timestamp: new Date()
        };

        dispatch(addingchat({ _id: grievance._id, chat: chatData }));

        // Optimistic update (optional, but good for UX - though Redux likely handles it via re-fetch or state update)
        // For now relying on dispatch triggering a refresh or state update if actions.js handles it.

        console.log("Sending message:", chatData);
        setMessage('');
    };

    const handleStatusUpdate = (newStatus) => {
        // Here we would dispatch an action to update status
        console.log(`Updating status to: ${newStatus}`);

        if (newStatus === 'Resolved') {
            setShowConfetti(true);
            // Stop confetti after a few seconds
            setTimeout(() => setShowConfetti(false), 5000);
        }

        // Mock update local state (in real app, redux would handle this via props)
        grievance.status = newStatus;
    };

    return (
        <>
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} style={{ zIndex: 10000 }} />}
            <Modal isOpen={isOpen} onClose={onClose} title="Grievance Details" maxWidth="max-w-3xl">
                <div className="space-y-6 font-sans">
                    {/* Header Info Card */}
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 leading-snug">{grievance.subject}</h3>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Filed on {new Date(grievance.createdOn).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <StatusInfo status={grievance.status} />
                                {/* Status Actions */}
                                {currentUserRole === 'user' && grievance.status !== 'Resolved' && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                                        onClick={() => handleStatusUpdate('Resolved')}
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" /> Mark as Resolved
                                    </Button>
                                )}
                                {currentUserRole === 'official' && (
                                    <select
                                        className="text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-1 px-2"
                                        value={grievance.status}
                                        onChange={(e) => handleStatusUpdate(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-blue-100">
                            <div className="flex items-center gap-2 text-gray-700 bg-white/50 p-2 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold">Dept:</span> {grievance.department}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 bg-white/50 p-2 rounded-lg">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold">Ward:</span> {grievance.wardno}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 bg-white/50 p-2 rounded-lg">
                                <Navigation className="w-4 h-4 text-blue-500" />
                                {/* Mock GPS display */}
                                <span className="font-semibold">GPS:</span>
                                {grievance.location ? `${grievance.location.lat.toFixed(2)}, ${grievance.location.lng.toFixed(2)}` : "N/A"}
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Section */}
                    {grievance.aiAnalysis && (
                        <div className="bg-purple-50/80 p-5 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                                <Sparkles className="w-24 h-24 text-purple-600" />
                            </div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-purple-900 mb-3">
                                <Sparkles className="w-4 h-4 text-purple-600 fill-purple-200" /> AI Smart Analysis
                            </h4>
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <p className="text-gray-800 text-sm font-medium leading-relaxed">"{grievance.aiAnalysis.summary}"</p>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        <span className={`text-xs px-2.5 py-1 rounded-md bg-white border font-medium ${grievance.aiAnalysis.sentiment === 'Negative' ? 'text-red-700 border-red-200 bg-red-50' : 'text-green-700 border-green-200 bg-green-50'}`}>
                                            Sentiment: {grievance.aiAnalysis.sentiment}
                                        </span>
                                        <span className="text-xs px-2.5 py-1 rounded-md bg-white border text-purple-700 border-purple-200 font-medium bg-purple-50">
                                            Category: {grievance.aiAnalysis.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-purple-200 pt-3 md:pt-0 md:pl-4">
                                    <span className="text-xs text-purple-600 uppercase tracking-widest font-bold mb-1">Priority Analysis</span>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${grievance.aiAnalysis.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                                        grievance.aiAnalysis.priority === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                            'bg-green-100 text-green-700 border-green-200'
                                        }`}>
                                        {grievance.aiAnalysis.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Description & Evidence */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Description
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 leading-relaxed min-h-[100px]">
                                    {grievance.description}
                                </div>
                            </div>

                            {/* Evidence Image */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Evidence
                                </h4>
                                {grievance.image ? (
                                    <div className="rounded-lg overflow-hidden border border-gray-200 h-48 bg-gray-100 relative group">
                                        <img src={grievance.image} alt="Evidence" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        <a href={grievance.image} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                                            View Full Size
                                        </a>
                                    </div>
                                ) : (
                                    <div className="h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                        No image attached
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Section */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between shrink-0">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <MessageIcon className="w-4 h-4" /> Discussion
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {grievance.chats ? grievance.chats.length : 0} messages
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
                                {grievance.chats && grievance.chats.length > 0 ? (
                                    grievance.chats.map((chatItem, idx) => {
                                        // Handle both Legacy (string) and New (object) formats
                                        let messageContent = '';
                                        let sender = 'User';

                                        if (typeof chatItem === 'string') {
                                            if (chatItem.startsWith('[OFFICIAL]:')) {
                                                sender = 'Official';
                                                messageContent = chatItem.replace('[OFFICIAL]: ', '');
                                            } else {
                                                messageContent = chatItem;
                                            }
                                        } else if (typeof chatItem === 'object' && chatItem !== null) {
                                            messageContent = chatItem.message || '';
                                            sender = chatItem.sender || 'User';
                                        }

                                        const isOfficial = sender === 'Official';

                                        return (
                                            <div key={idx} className={`flex w-full ${isOfficial ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`flex max-w-[85%] ${isOfficial ? 'flex-row' : 'flex-row-reverse'} gap-2 items-end`}>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isOfficial ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                                        {isOfficial ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    </div>
                                                    <div className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${isOfficial
                                                        ? 'bg-blue-50 text-blue-900 rounded-bl-none border border-blue-100'
                                                        : 'bg-gray-900 text-white rounded-br-none'
                                                        }`}>
                                                        {isOfficial && <span className="text-xs font-bold block text-blue-600 mb-0.5">Official Response</span>}
                                                        {messageContent}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <MessageIcon className="w-8 h-8 opacity-20 mb-2" />
                                        <p className="text-sm">No updates yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            {grievance.status !== 'Resolved' && (
                                <div className="p-3 bg-gray-50 border-t flex gap-2 shrink-0">
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="min-h-[44px] h-[44px] resize-none bg-white focus-visible:ring-1 focus-visible:ring-blue-500"
                                    />
                                    <Button size="icon" className="h-[44px] w-[44px] bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0" onClick={handleSendMessage}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

const StatusInfo = ({ status }) => {
    const styles = {
        'Resolved': 'bg-green-100 text-green-700 ring-green-600/20',
        'Pending': 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
        'In Progress': 'bg-blue-100 text-blue-700 ring-blue-600/20'
    };
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${styles[status] || styles['Pending']}`}>
            {status}
        </span>
    )
}

function MessageIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
    )
}

export default GrievanceDetailsModal
