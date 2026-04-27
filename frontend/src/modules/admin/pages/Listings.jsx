import React from 'react';
import { 
  Building2, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import { AdminTable, AdminTableRow, AdminTableCell, StatusBadge, ActionButton } from '../components/common/AdminUI';
import { listings } from '../data/data';

const Listings = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Listing Moderation</h1>
           <p className="text-slate-500 text-sm mt-1">Monitor property postings and manage content quality.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={16} />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64"
              />
           </div>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary-600 transition-all">
              <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Table Card */}
      <Card noPadding className="border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
         <AdminTable headers={["Property Name", "Details", "Price", "Posted By", "Status", "Actions"]}>
            {listings.map(item => (
               <AdminTableRow key={item.id}>
                  <AdminTableCell>
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                           <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100&h=100&u=${item.id}`} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 leading-tight">{item.title}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #BPS-{1000 + item.id}</p>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                           <MapPin size={12} className="text-primary-500" />
                           {item.location}
                        </p>
                        <div className="flex items-center gap-2">
                           <StatusBadge type={item.type}>{item.type}</StatusBadge>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                        </div>
                     </div>
                  </AdminTableCell>
                  <AdminTableCell className="text-sm font-black text-slate-900">
                     ₹{(item.price / 10000000).toFixed(2)} Cr
                  </AdminTableCell>
                  <AdminTableCell>
                     <p className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-all cursor-pointer underline decoration-dotted underline-offset-4 decoration-slate-200 hover:decoration-primary-600">{item.broker}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 cursor-pointer hover:text-slate-900">View History</p>
                  </AdminTableCell>
                  <AdminTableCell><StatusBadge type={item.status} /></AdminTableCell>
                  <AdminTableCell>
                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Eye size={16} />} label="View Listing" variant="primary" />
                        <ActionButton icon={<Edit3 size={16} />} label="Edit" variant="ghost" />
                        <ActionButton icon={<AlertTriangle size={16} />} label="Mark as Spam" variant="danger" />
                        <ActionButton icon={<Trash2 size={16} />} label="Delete" variant="danger" />
                     </div>
                  </AdminTableCell>
               </AdminTableRow>
            ))}
         </AdminTable>
      </Card>
    </div>
  );
};

export default Listings;
