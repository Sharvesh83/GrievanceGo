import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addingchat } from './Redux/actions'
import Modal from './Modal'

const ReplyModal = ({ onClose, complaint }) => {
    const { subject, description, _id } = complaint
    const [showInput, setShowInput] = useState(false)
    const [chat, setChat] = useState('')

    const handleReplyClick = () => {
        setShowInput(true)
    }

    const data_chats = useSelector(state => state.info)
    const redData = data_chats.filter(elem => {
        return elem._id == complaint._id
    })
    // console.log('data_chats', redData) //Needs to be removed before deploying

    const dispatch = useDispatch()
    let addChat = () => {
        const chatData = {
            sender: 'Official', // ReplyModal is distinctively for officials or replies? Assuming standard reply usually implies user or context based, but code had 'Official' hardcoded logic in viewer. 
            // Wait, previous viewer checked for [OFFICIAL] prefix. 
            // Let's stick to 'Official' here if this modal is for officials (implied by name or context usually).
            // Actually, let's look at usage. ReplyModal usually used by officials in this app context based on `OfficialDashboard`.
            // Let's look at imports in OfficialDashboard. Yes, it imports ReplyModal.
            message: chat,
            timestamp: new Date()
        }
        dispatch(addingchat({ _id, chat: chatData }))
        setChat('') // Clear input after sending
    }

    const footer = (
        <div className="w-full flex justify-end">
            {showInput ? (
                <div className="flex w-full items-center">
                    <input
                        className="w-full h-[39px] px-3 bg-white mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your message"
                        value={chat}
                        onChange={event => {
                            setChat(event.target.value)
                        }}
                    />
                    <button
                        className="bg-black text-white px-4 py-2 rounded h-[39px] hover:bg-gray-800 transition-colors"
                        onClick={addChat}
                    >
                        Send
                    </button>
                </div>
            ) : (
                <button
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    onClick={handleReplyClick}
                >
                    Reply
                </button>
            )}
        </div>
    )

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            footer={footer}
            size="xl"
            contentClassName="bg-[#A9A0DE]" // rgba(169, 160, 222, 1)
        >
            <div className="p-1">
                <div className="bg-[#6553C1] text-white p-4 rounded-md font-bold mb-4 font-['Roboto']">
                    <div>
                        <span className="block mb-1">{subject}</span>
                        <span className="block font-normal pt-1">{description}</span>
                    </div>
                </div>
                <div className="bg-transparent mt-4 overflow-y-auto max-h-[231px] px-1">
                    {redData[0].chats?.map((comp, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white mt-2 p-3 rounded-md w-full font-bold shadow-sm"
                            >
                                <div>
                                    <p className="font-['Roboto'] font-medium text-[15px] w-[80%]">
                                        {comp}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>
    )
}

export default ReplyModal
