import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SimpleToastProps {
    isVisible: boolean;
    onClose: () => void;
}

const SimpleToast: React.FC<SimpleToastProps> = ({ isVisible, onClose }) => {

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-sm">Feature is currently not available.</span>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default SimpleToast