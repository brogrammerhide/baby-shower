import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ocean/20 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-6 py-4">
              <h3 className="font-pacifico text-lg text-ocean">{title}</h3>
              <button 
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-ocean transition hover:bg-white cursor-pointer"
              >
                <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
