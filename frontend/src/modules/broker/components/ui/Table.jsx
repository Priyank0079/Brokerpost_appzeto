import React from 'react';

const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
                  {header}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors group ${className}`}>{children}</tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 py-4 text-sm text-slate-600 ${className}`}>{children}</td>
);

export default Table;
