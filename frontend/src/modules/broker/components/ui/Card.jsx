import React from 'react';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden ${className}`}
      {...props}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-center justify-between mb-6 ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-6 mt-6 border-t border-slate-50 ${className}`}>
    {children}
  </div>
);

export default Card;
