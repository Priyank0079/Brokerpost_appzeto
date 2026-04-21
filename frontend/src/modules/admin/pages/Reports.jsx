import React from 'react';
import { 
  Download, 
  BarChart3, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  FileText
} from 'lucide-react';
import Card from '../../broker/components/ui/Card';
import Button from '../../broker/components/ui/Button';

const Reports = () => {
  const reportCards = [
    { title: 'Revenue Report', scale: 'Monthly', value: '₹12.45L', growth: '+14.2%', up: true },
    { title: 'Broker Growth', scale: 'Weekly', value: '142', growth: '+8.1%', up: true },
    { title: 'Listing Volume', scale: 'Daily', value: '892', growth: '-2.4%', up: false },
    { title: 'Conversion Rate', scale: 'Monthly', value: '18.5%', growth: '+4.2%', up: true },
  ];

  return (
    <div className="space-y-10 animate-fade-in py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Analytics & Reports</h1>
           <p className="text-slate-500 font-medium mt-1">Export detailed platform data and monitor performance trends.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="bg-white px-6 font-bold" leftIcon={<Filter size={18} />}>Filter Date</Button>
           <Button variant="primary" className="px-6 font-bold shadow-lg shadow-primary-600/20" leftIcon={<Download size={18} />}>Export CSV</Button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card, i) => (
          <Card key={i} className="hover:border-primary-100 transition-all border-slate-100 shadow-xl shadow-slate-200/20">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.scale}</span>
                <div className={`flex items-center gap-1 text-xs font-black ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
                   {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {card.growth}
                </div>
             </div>
             <h3 className="text-2xl font-black text-slate-900 leading-none">{card.value}</h3>
             <p className="text-sm font-bold text-slate-500 mt-2">{card.title}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Performance Chart Placeholder */}
         <Card title="Traffic & Conversion Trends" className="border-slate-100">
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 mt-4 overflow-hidden relative group">
               <BarChart3 size={48} className="text-slate-200 group-hover:scale-110 transition-transform" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Generating Visualization...</p>
               
               {/* Mock Bars */}
               <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2 h-32 opacity-20 group-hover:opacity-40 transition-opacity">
                  {[40, 70, 45, 90, 65, 80, 55, 30, 85, 50, 95, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary-600 rounded-t-lg transition-all duration-700" style={{ height: `${h}%` }} />
                  ))}
               </div>
            </div>
         </Card>

         {/* Distribution Chart Placeholder */}
         <Card title="Vertical Distribution" className="border-slate-100">
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 mt-4 relative group">
               <PieIcon size={48} className="text-slate-200 group-hover:rotate-12 transition-transform" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Analyzing segments...</p>
               
               <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-3">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                     <span className="text-xs font-bold text-slate-600">Residential (64%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                     <span className="text-xs font-bold text-slate-600">Commercial (22%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                     <span className="text-xs font-bold text-slate-600">Industrial (10%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                     <span className="text-xs font-bold text-slate-600">Land (4%)</span>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* Exportable Log Section */}
      <Card noPadding title="Available Data Exports" className="border-slate-100 overflow-hidden">
         <div className="divide-y divide-slate-50">
            {[
              { name: 'Full Broker Directory', size: '2.4 MB', type: 'CSV/Excel', updated: 'Today, 10:30 AM' },
              { name: 'Subscription Transaction History', size: '1.1 MB', type: 'PDF/CSV', updated: 'Yesterday' },
              { name: 'Active Listing Inventory', size: '8.9 MB', type: 'JSON/Excel', updated: '2 hours ago' },
              { name: 'Platform Activity Audit', size: '540 KB', type: 'PDF', updated: 'Today, 04:15 PM' },
            ].map((report, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h5 className="text-sm font-bold text-slate-900">{report.name}</h5>
                       <p className="text-xs text-slate-500 mt-1">Generated {report.updated} • {report.size}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">{report.type}</span>
                    <button className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                       <Download size={18} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
};

export default Reports;
