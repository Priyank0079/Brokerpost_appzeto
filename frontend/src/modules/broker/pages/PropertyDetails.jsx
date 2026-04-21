import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  Phone, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  Building,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { listings } from '../data/listings';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // For demo, we just pick the first listing or by ID
  const item = listings.find(l => l.id === parseInt(id)) || listings[0];

  const features = ["24/7 Security", "Swimming Pool", "Gymnasium", "Parking Space", "Power Backup", "Garden View", "Gas Connection"];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
         <Button variant="ghost" leftIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}>Back to Inventory</Button>
         <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Share2 size={18} /></button>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Bookmark size={18} /></button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery & Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery Mockup */}
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[450px]">
             <div className="col-span-3 row-span-2 rounded-2xl overflow-hidden shadow-sm relative">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6">
                   <Badge variant="success" className="bg-white/90 backdrop-blur-md border-none shadow-lg px-4 py-2 text-sm">READY TO MOVE</Badge>
                </div>
             </div>
             <div className="rounded-2xl overflow-hidden bg-slate-100"><img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" /></div>
             <div className="rounded-2xl overflow-hidden bg-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-slate-900/60 transition-all">
                   +12 MORE
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-start justify-between">
                <div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight">{item.title}</h1>
                   <p className="text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={16} className="text-primary-600" />
                      {item.location}
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-black text-primary-600">₹{(item.price / 10000000).toFixed(2)} Cr</p>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ESTIMATED VALUATION</p>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Bed size={20} /></div>
                   <div><p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Beds</p><p className="font-bold text-slate-900">{item.beds || 3} BHK</p></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Bath size={20} /></div>
                   <div><p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Baths</p><p className="font-bold text-slate-900">{item.baths || 3}</p></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Square size={20} /></div>
                   <div><p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Area</p><p className="font-bold text-slate-900">{item.sqft} sq.ft</p></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Calendar size={20} /></div>
                   <div><p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Listed</p><p className="font-bold text-slate-900">2 Days ago</p></div>
                </div>
             </div>

             <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-slate-900">About this Property</h3>
                <p className="text-slate-600 leading-relaxed">
                   Experience ultra-luxury living at this magnificent {item.title}. This residence offers breathtaking views of the city skyline and features high-end finishes throughout. 
                   With its spacious floor plan and premium materials, every corner reflects sophistication and comfort. 
                   Located in a prime residential area with immediate access to schools, hospitals, and shopping malls. 
                   Perfect for executives and families seeking a premium lifestyle.
                </p>
             </div>

             <div className="space-y-4 pt-6">
                <h3 className="text-xl font-bold text-slate-900">Key Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                   {features.map(f => (
                     <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Check size={12} strokeWidth={3} /></div>
                        {f}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
           {/* Broker Card */}
           <Card className="border-primary-100 shadow-xl shadow-primary-500/5">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-24 h-24 rounded-2xl bg-slate-100 relative border-4 border-white shadow-md overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=amit" alt="" className="w-full h-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white border-2 border-white">
                       <ShieldCheck size={12} />
                    </div>
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-slate-900">{item.broker || 'Amit Sharma'}</h4>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">PREMIUM BROKER</p>
                    <p className="text-xs text-slate-400 mt-2">Specialized in South Mumbai • 12 years Exp.</p>
                 </div>
                 
                 <div className="w-full h-[1px] bg-slate-100" />
                 
                 <div className="grid grid-cols-2 w-full gap-4">
                    <div className="text-center">
                       <p className="text-sm font-bold text-slate-900">124</p>
                       <p className="text-[10px] text-slate-400 uppercase tracking-wider">Postings</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                       <p className="text-sm font-bold text-slate-900">4.9/5</p>
                       <p className="text-[10px] text-slate-400 uppercase tracking-wider">Rating</p>
                    </div>
                 </div>

                 <div className="w-full space-y-3 pt-2">
                    <Button variant="primary" className="w-full py-4 text-xs font-bold uppercase tracking-widest" leftIcon={<Phone size={14} />}>Call Broker</Button>
                    <Button variant="outline" className="w-full py-4 text-xs font-bold uppercase tracking-widest">Connect on WhatsApp</Button>
                 </div>
              </div>
           </Card>

           {/* Quick Stats */}
           <Card className="bg-slate-900 border-none">
              <div className="space-y-4">
                 <h4 className="text-sm font-bold text-white uppercase tracking-widest">Brokerage Offer</h4>
                 <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <p className="text-3xl font-black text-white">2%</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">STANDARD COMMISSION</p>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed italic">
                    "Open to discussion for clean clients and quick closure. Documents verified."
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
