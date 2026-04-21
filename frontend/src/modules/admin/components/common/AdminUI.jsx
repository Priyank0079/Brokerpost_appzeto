import React from 'react';

export const AdminTable = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const AdminTableRow = ({ children, className = "" }) => (
  <tr className={`hover:bg-slate-50/80 transition-colors group ${className}`}>
    {children}
  </tr>
);

export const AdminTableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-5 align-middle ${className}`}>
    {children}
  </td>
);

export const StatusBadge = ({ type, children }) => {
  const styles = {
    Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
    Blocked: 'bg-red-50 text-red-600 border-red-100',
    Spam: 'bg-red-50 text-red-600 border-red-100',
    Expired: 'bg-slate-50 text-slate-400 border-slate-200',
    Success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Failed: 'bg-red-50 text-red-600 border-red-100',
    Gold: 'bg-purple-50 text-purple-600 border-purple-100',
    Silver: 'bg-blue-50 text-blue-600 border-blue-100',
    Free: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider h-fit inline-block ${styles[type] || styles.Free}`}>
      {children || type}
    </span>
  );
};

export const ActionButton = ({ icon, onClick, label, variant = 'ghost' }) => {
   const variants = {
     ghost: 'text-slate-400 hover:text-slate-900 hover:bg-white',
     danger: 'text-slate-400 hover:text-red-600 hover:bg-red-50',
     success: 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50',
     primary: 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'
   };

   return (
     <button 
       onClick={onClick}
       title={label}
       className={`p-2 rounded-lg transition-all ${variants[variant]}`}
     >
       {icon}
     </button>
   );
};
