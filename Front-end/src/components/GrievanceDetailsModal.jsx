import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addingchat, getinfo } from './Redux/actions';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area'; // Will need to mock or build simple scroll div
import { Send, User as UserIcon, Shield } from "lucide-react";

const GrievanceDetailsModal = ({ isOpen, onClose, grievance, currentUserRole = 'user' }) => {
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();

    if (!grievance) return null;

    const handleSendMessage = () => {
        if (!message.trim()) return;

        // Simple prefix based on role to distinguish messages
        const prefix = currentUserRole === 'official' ? '[OFFICIAL]: ' : '';
        const fullMessage = `${prefix}${message}`;

        dispatch(addingchat({
            _id: grievance._id,
            chat: fullMessage
        }));

        setMessage('');
        // Optimistic refresh
        setTimeout(() => dispatch(getinfo(currentUserRole === 'user' ? grievance.userId : null)), 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Grievance Details">
            <div className="space-y-6">
                {/* Details Section */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-muted-foreground">Subject</p>
                        <p>{grievance.subject}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-muted-foreground">Department</p>
                        <p>{grievance.department}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${grievance.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {grievance.status}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-muted-foreground">Ward No</p>
                        <p>{grievance.wardno}</p>
                    </div>
                </div>

                <div className="bg-secondary/10 p-3 rounded-md border text-sm">
                    <p className="font-semibold text-muted-foreground mb-1">Description</p>
                    <p>{grievance.description}</p>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <MessageIcon className="w-4 h-4" /> Discussion
                    </h3>

                    {/* Chat History */}
                    <div className="h-48 overflow-y-auto border rounded-md p-3 space-y-3 bg-secondary/5 mb-4 custom-scrollbar">
                        {grievance.chats && grievance.chats.length > 0 ? (
                            grievance.chats.map((chat, idx) => {
                                const isOfficial = chat.startsWith('[OFFICIAL]:');
                                const cleanMsg = chat.replace('[OFFICIAL]: ', '');
                                return (
                                    <div key={idx} className={`flex ${isOfficial ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isOfficial ? 'bg-blue-100 text-blue-900' : 'bg-primary text-primary-foreground'}`}>
                                            {isOfficial && <span className="text-xs font-bold block text-blue-700 mb-0.5">Official</span>}
                                            {cleanMsg}
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-center text-xs text-muted-foreground py-10">No messages yet.</p>
                        )}
                    </div>

                    {/* Input Area */}
                    {grievance.status !== 'Resolved' && (
                        <div className="flex gap-2">
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="min-h-[40px] h-[40px] resize-none"
                            />
                            <Button size="icon" onClick={handleSendMessage}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
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
