import React, { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', contentClassName = '' }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl', // Added for larger modals like NewComplaint
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        full: 'max-w-full'
    }[size] || 'max-w-md';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Content */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidthClass} z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 ${contentClassName}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
