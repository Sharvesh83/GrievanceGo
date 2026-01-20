import React from 'react'
import Modal from './Modal'

const WarningModal = ({ onClose, onConfirm }) => {
    const footer = (
        <>
            <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors font-bold"
                onClick={onConfirm}
            >
                Resolve
            </button>
            <button
                className="text-black bg-transparent hover:bg-white/20 px-4 py-2 rounded transition-colors font-bold"
                onClick={onClose}
            >
                Cancel
            </button>
        </>
    )

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            footer={footer}
            size="md"
            contentClassName="bg-[#A9A0DE]" // rgba(169, 160, 222, 1)
        >
            <div className="text-[18px] font-bold py-5">
                Are you sure you want to mark this complaint as
                resolved? This action cannot be undone.
            </div>
        </Modal>
    )
}

export default WarningModal
