import React from 'react';
import { Menu } from 'lucide-react';

const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-[30]">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
           <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
      </div>
    </header>
  );
};

export default AdminNavbar;
