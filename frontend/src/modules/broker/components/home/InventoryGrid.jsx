import React from 'react';
import { MapPin, Maximize2, Clock, Grid, Table, MessageSquare } from 'lucide-react';

const InventoryGrid = () => {
  const [view, setView] = React.useState('grid');

  const listings = [
    {
      id: 1,
      type: 'Commercial',
      status: 'AVAILABLE FOR LEASE - STANDALONE BUILDING',
      title: 'Sector-8',
      location: 'IMT Manesar',
      features: ['10000 Sq.Mt', 'Ready to Move', 'FOR LEASE'],
      price: '₹2,00,000',
      image: '/assets/office.png'
    },
    {
      id: 2,
      type: 'Commercial',
      status: 'AVAILABLE FOR LEASE - SHOPS/SHOWROOM',
      title: 'Sector-37',
      location: 'Pace City 2',
      features: ['250 Sq.Mt', 'Vacant', 'FOR LEASE'],
      price: '₹2,00,000',
      image: '/assets/showroom.png'
    },
    {
      id: 3,
      type: 'Commercial',
      status: 'AVAILABLE FOR SALE - OFFICE',
      title: 'Sector-102',
      location: 'Satya Hive',
      features: ['468 Sq.Ft', 'Ready to Move', 'COM. SALE'],
      price: '₹65,00,000',
      image: '/assets/office.png'
    },
    {
      id: 4,
      type: 'Commercial',
      status: 'AVAILABLE FOR SALE - RETAIL SHOPS/SHOWROOM',
      title: 'Sector-113',
      location: 'M3M Capital Walk',
      features: ['1336 Sq.Ft', 'Under Construction', 'COM. SALE'],
      price: '₹6,14,56,000',
      image: '/assets/mall.png'
    },
    {
      id: 5,
      type: 'Commercial',
      status: 'AVAILABLE FOR LEASE - OFFICE',
      title: 'M G Road',
      location: 'Sewa Corporate Park',
      features: ['2500 Sq.Ft', 'Ready to Move', 'FOR LEASE'],
      price: '₹1,50,000',
      image: '/assets/office.png'
    },
    {
      id: 6,
      type: 'Commercial',
      status: 'WANTED ON LEASE - OFFICE',
      title: 'NH-8',
      location: 'BPTB Park Centra',
      features: ['5000 Sq.Ft', 'Urgent Requirement', 'WANTED'],
      price: 'Budget: ₹3L',
      image: '/assets/office.png'
    },
    {
      id: 7,
      type: 'Commercial',
      status: 'WANTED ON PURCHASE - OFFICE',
      title: 'Sector-61',
      location: 'Emmar Digital Greens',
      features: ['1200 Sq.Ft', 'Investment Purpose', 'WANTED'],
      price: 'Budget: ₹1.5Cr',
      image: '/assets/office.png'
    },
    {
      id: 8,
      type: 'Commercial',
      status: 'AVAILABLE FOR LEASE - OFFICE',
      title: 'Golf Course Ext.',
      location: 'M3M IFC',
      features: ['1800 Sq.Ft', 'Warm Shell', 'FOR LEASE'],
      price: '₹1,80,000',
      image: '/assets/office.png'
    },
    {
      id: 9,
      type: 'Commercial',
      status: 'AVAILABLE FOR SALE - SCO PLOT',
      title: 'Sector-114',
      location: 'Emaar Business District',
      features: ['100 Sq.Yd', 'Possession Soon', 'COM. SALE'],
      price: '₹4,50,00,000',
      image: '/assets/showroom.png'
    },
    {
      id: 10,
      type: 'Commercial',
      status: 'AVAILABLE FOR LEASE - RETAIL',
      title: 'Sector-65',
      location: 'M3M 65th Avenue',
      features: ['850 Sq.Ft', 'Ground Floor', 'FOR LEASE'],
      price: '₹1,25,000',
      image: '/assets/mall.png'
    }
  ];

  return (
    <section className="bg-pink-50/30 pt-12 pb-6 px-6 lg:px-20">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif text-[#0f172a] mb-1">All Listed Inventory</h2>
            <p className="text-slate-500 text-sm">10 listings found</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-400 ml-2">View:</span>
            <button 
              onClick={() => setView('grid')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                view === 'grid' ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Grid size={14} />
              Grid
            </button>
            <button 
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                view === 'table' ? 'bg-[#1a365d] text-white shadow-lg shadow-[#1a365d]/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Table size={14} />
              Table
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all group">
                {/* Image Area */}
                <div className="h-32 bg-slate-100 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#fdfaf3]">
                      <div className="text-[#c8962a]/20">
                        <Maximize2 size={36} />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[#c8962a] text-[10px] font-bold shadow-sm border border-[#c8962a]/10">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-[8px] font-bold text-[#c8962a] uppercase tracking-wider mb-1.5">
                    {item.status}
                  </p>
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-[9px] mb-3">
                    <MapPin size={10} />
                    {item.location}
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className={`px-2 py-0.5 rounded-md text-[8px] font-bold ${
                          idx === 0 ? 'bg-slate-50 text-slate-500 border border-slate-100' :
                          idx === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <p className="text-base font-bold text-[#0f172a]">{item.price}</p>
                    <button className="px-3 py-1.5 rounded-xl bg-[#1a365d] text-white text-[9px] font-bold hover:bg-[#2a4a7d] transition-all">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9F6F0] border-b border-slate-200">
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">#</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sub-type</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Area</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Price</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Connect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((item, idx) => {
                    const statusParts = item.status.split(' - ');
                    const section = statusParts[0];
                    const subType = statusParts[1];
                    
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="py-4 px-6 text-[11px] text-slate-400">{idx + 1}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 rounded bg-primary-50 text-primary-600 text-[9px] font-bold">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                            subType?.includes('BUILDING') ? 'bg-purple-50 text-purple-600' :
                            subType?.includes('SHOPS') ? 'bg-primary-50 text-primary-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {subType || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[11px] text-slate-500 capitalize">
                          {section.toLowerCase()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#0f172a]">{item.title}</span>
                            <span className="text-[9px] text-slate-400">{item.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[11px] text-[#0f172a] font-medium">
                          {item.features[0]}
                        </td>
                        <td className="py-4 px-6 text-[11px] font-bold text-emerald-600">
                          {item.price}
                        </td>
                        <td className="py-4 px-6">
                          {item.features[1] && (
                            <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                              item.features[1].includes('Ready') ? 'bg-emerald-50 text-emerald-600' :
                              item.features[1].includes('Vacant') ? 'bg-primary-50 text-primary-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {item.features[1]}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="px-4 py-1.5 rounded-lg bg-[#1a365d] text-white text-[9px] font-bold hover:bg-[#2a4a7d] transition-all">
                            Connect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InventoryGrid;
