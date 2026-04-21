import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-400 ml-1">{label}</label>}
      <input
        className={`
          bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 placeholder:text-slate-600
          focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
