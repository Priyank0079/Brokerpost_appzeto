import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="flex justify-end gap-3 p-6 bg-slate-50 border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
