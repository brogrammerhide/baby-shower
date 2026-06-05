import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep/60 backdrop-blur-xl" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative z-10 w-full max-w-md my-auto rounded-[32px] bg-white shadow-[0_32px_128px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-6 py-5">
              <h3 className="font-pacifico text-xl text-ocean">{title}</h3>
              <button 
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ocean shadow-soft transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-7">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
