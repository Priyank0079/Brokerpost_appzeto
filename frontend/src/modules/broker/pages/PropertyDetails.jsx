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
  Check,
  Compass,
  Home as HomeIcon,
  MessageCircle,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { listings } from '../data/listings';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = listings.find(l => l.id === parseInt(id)) || listings[0];

  const handleWhatsAppConnect = () => {
    const message = `Hi, I'm interested in "${item.title}" (ID: #BPS-${item.id + 1000}) located in ${item.location}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    "24/7 Security & Surveillance",
    "Private Infinity Pool",
    "High-Performance Gym",
    "Dedicated Concierge Service",
    "Three-Level Basement Parking",
    "Smart Home Automation",
    "Sky Garden & Lounge"
  ];

  const specs = [
    { label: "Floor", value: "24th of 32", icon: <Building size={16} /> },
    { label: "Facing", value: "East (Sea View)", icon: <Compass size={16} /> },
    { label: "Furnishing", value: "Fully Furnished", icon: <HomeIcon size={16} /> },
    { label: "Age of Prop.", value: "Brand New", icon: <Calendar size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-12 animate-fade-in overflow-x-hidden">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-2.5 md:py-4 md:mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <Button 
             variant="ghost" 
             className="hover:bg-slate-50 rounded-xl px-2 md:px-4"
             leftIcon={<ArrowLeft size={18} />} 
             onClick={() => navigate(-1)}
           >
             <span className="hidden sm:inline">Back to Network</span>
             <span className="sm:hidden text-[10px] font-black uppercase tracking-widest">Back</span>
           </Button>
           <div className="flex items-center gap-1.5 md:gap-2">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-slate-100 rounded-lg md:rounded-xl text-slate-500 hover:text-slate-900 transition-all"><Share2 size={16} /></button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-slate-100 rounded-lg md:rounded-xl text-slate-500 hover:text-slate-900 transition-all"><Bookmark size={16} /></button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6 md:space-y-10">
            
            {/* Cinematic Gallery */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4">
                 <div className="md:col-span-3 md:row-span-2 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl relative group h-[280px] md:h-[500px]">
                    <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 md:top-8 md:left-8 flex flex-wrap gap-2">
                       <Badge variant="success" className="bg-emerald-500 text-white shadow-lg px-2.5 py-1 md:px-6 md:py-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest border-none">PREMIUM LISTING</Badge>
                       <Badge className="bg-white/90 backdrop-blur-md text-slate-900 shadow-lg px-2.5 py-1 md:px-6 md:py-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest border-none">NEW LAUNCH</Badge>
                    </div>
                 </div>
                 <div className="hidden md:block rounded-[2rem] overflow-hidden shadow-lg border border-slate-100"><img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" /></div>
                 <div className="hidden md:block rounded-[2rem] overflow-hidden shadow-lg relative border border-slate-100">
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white cursor-pointer">
                       <span className="text-2xl font-black">+12</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">Glimpses</span>
                    </div>
                 </div>
              </div>
            </section>

            {/* Core Info */}
            <section className="space-y-5 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                 <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2 mb-0.5">
                       <Badge variant="secondary" className="bg-primary-50 text-primary-600 border-none font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] px-2 py-1">{item.type}</Badge>
                       <span className="text-slate-200">•</span>
                       <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">ID: #BPS-{item.id + 1000}</span>
                    </div>
                    <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] md:leading-tight">{item.title}</h1>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs md:text-lg">
                       <MapPin size={16} className="text-primary-500 flex-shrink-0" />
                       <span className="truncate">{item.location}</span>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 md:p-10 rounded-xl md:rounded-[3rem] md:text-right border border-slate-100 flex flex-col items-start md:items-end relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-all" />
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-0.5 md:mb-2 italic">Asking Price</p>
                    <p className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter">
                      ₹{item.price > 0 ? (item.price >= 10000000 ? `${(item.price / 10000000).toFixed(2)} Cr` : `${(item.price / 100000).toFixed(2)} L`) : 'Contact'}
                    </p>
                    <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest mt-0.5 md:mt-2">Negotiable on table</p>
                 </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                 {specs.map(spec => (
                   <div key={spec.label} className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-white border border-slate-50 shadow-soft space-y-2 md:space-y-3 hover:border-primary-100 transition-all group">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">{spec.icon}</div>
                      <div>
                         <p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{spec.label}</p>
                         <p className="font-black text-slate-900 text-[11px] md:text-base">{spec.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Metric Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-4 md:py-8 border-y border-slate-50">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Bed size={20} /></div>
                    <div><p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest italic">Accommodation</p><p className="text-base md:text-lg font-black text-slate-900">{item.beds || 3} BHK Luxury</p></div>
                 </div>
                 <div className="flex items-center gap-3 md:gap-4 md:border-x md:border-slate-50 md:px-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><Bath size={20} /></div>
                    <div><p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest italic">Washrooms</p><p className="text-base md:text-lg font-black text-slate-900">{item.baths || 3} Plumbed</p></div>
                 </div>
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Square size={20} /></div>
                    <div><p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest italic">Built-up Area</p><p className="text-base md:text-lg font-black text-slate-900">{item.sqft.toLocaleString()} sq.ft</p></div>
                 </div>
              </div>
            </section>

            {/* Detailed Description */}
            <section className="space-y-4 md:space-y-6">
               <div className="flex items-center gap-3 md:gap-4">
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tight">Narrative Deep-Dive</h3>
                  <div className="h-[2px] flex-1 bg-slate-50" />
               </div>
               <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 text-sm md:text-xl leading-relaxed font-medium">
                     Experience a life of uncompromised luxury at this breathtaking {item.title}. Situated at the most coveted address in {item.location.split(',')[0]}, this residence is an architectural masterpiece designed for the global elite.
                  </p>
               </div>
               <div className="flex flex-wrap gap-1.5 md:gap-3">
                  {["Vastu Compliant", "Sea Facing", "High ROI", "Gated Community"].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest">{tag}</span>
                  ))}
               </div>
            </section>

            {/* Amenities Grid */}
            <section className="space-y-6 bg-slate-950 p-6 md:p-12 rounded-2xl md:rounded-[3.5rem] shadow-xl">
               <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base md:text-xl font-black text-white uppercase tracking-[0.2em]">Premium Amenities</h3>
                  <Badge variant="primary" className="bg-primary-500 text-white border-none font-black text-[8px] px-3 py-1 italic">Verified</Badge>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 md:gap-x-12">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-3 group">
                       <div className="w-7 h-7 rounded-full bg-white/5 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                         <Check size={14} strokeWidth={4} />
                       </div>
                       <span className="text-xs md:text-base font-bold text-slate-300 tracking-tight group-hover:text-white transition-colors">{f}</span>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Business Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
             <div className="lg:sticky lg:top-28 space-y-6 lg:space-y-8 pb-12 lg:pb-0">
                {/* Broker Card */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl md:rounded-[3rem] overflow-hidden p-0 ring-1 ring-slate-50">
                  <div className="bg-slate-50 p-6 md:p-10 text-center space-y-5 border-b border-white">
                     <div className="relative inline-block">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border-4 border-full shadow-2xl overflow-hidden mx-auto transform -rotate-3 hover:rotate-0 transition-transform">
                           <img src="https://i.pravatar.cc/150?u=amit" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 md:w-11 md:h-11 bg-primary-600 rounded-xl flex items-center justify-center text-white border-4 border-slate-50 shadow-xl">
                           <ShieldCheck size={16} />
                        </div>
                     </div>
                     <div>
                        <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{item.broker || 'Amit Sharma'}</h4>
                        <p className="text-primary-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-0.5">Verified Power Broker</p>
                     </div>
                  </div>
                  
                  <div className="p-6 md:p-10 space-y-6 md:space-y-8 bg-white">
                     <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 text-center border border-slate-100">
                           <p className="text-base md:text-xl font-black text-slate-900">124</p>
                           <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">Managed</p>
                        </div>
                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 text-center border border-slate-100">
                           <p className="text-base md:text-xl font-black text-slate-900">4.9</p>
                           <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">Trust</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <Button className="w-full py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:translate-y-[-1px] transition-all" leftIcon={<Phone size={18} />}>Reveal Contact</Button>
                        <Button 
                          variant="outline" 
                          onClick={handleWhatsAppConnect}
                          className="w-full py-4 md:py-6 border-2 border-emerald-50 text-emerald-600 rounded-xl md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-emerald-50 transition-all" 
                          leftIcon={<MessageCircle size={18} />}
                        >
                          WhatsApp
                        </Button>
                     </div>
                  </div>
                </Card>

                {/* Brokerage Card */}
                <Card className="bg-slate-900 border-none rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all" />
                   <div className="space-y-5 relative z-10">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-60">Brokerage</h4>
                         <Badge variant="primary" className="bg-primary-500/10 text-primary-400 border border-primary-500/20 text-[8px] px-2 py-0.5 font-black uppercase">Standard</Badge>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/5 text-center">
                         <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">2.0%</p>
                         <p className="text-[9px] text-primary-400 font-black uppercase tracking-widest mt-1.5 italic">Commission</p>
                      </div>
                   </div>
                </Card>
             </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 p-3.5 pb-7 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-500">
         <Button className="flex-2 w-[65%] py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/10" leftIcon={<Phone size={14} />}>Call Broker</Button>
         <Button 
            variant="outline" 
            onClick={handleWhatsAppConnect}
            className="flex-1 py-3.5 border-2 border-emerald-500 text-emerald-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50"
         >
           Chat
         </Button>
      </div>
    </div>
  );
};

export default PropertyDetails;
