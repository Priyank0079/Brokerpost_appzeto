import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ArrowRight, 
  MapPin, 
  TrendingUp, 
  Globe,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  ShieldCheck,
  Zap,
  Clock,
  Eye,
  Heart,
  Share2,
  LayoutTemplate,
  Phone,
  Users
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import networkFeature from '../assets/common/network_feature.png';
import commercialCta from '../assets/common/commercial_cta.png';
import residentialCta from '../assets/common/residential_cta.png';

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([
    {
      title: "Premium Glass Villas",
      subtitle: "Luxury Living Redefined",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600&h=600",
      badge: "Featured"
    },
    {
      title: "Commercial Office Hubs",
      subtitle: "Global Workspace Network",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600&h=600",
      badge: "Exclusive"
    },
    {
      title: "Penthouse Collection",
      subtitle: "Experience the Skyline",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600&h=600",
      badge: "Luxurious"
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('homepage_carousel');
    if (saved) {
      setSlides(JSON.parse(saved));
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (slides?.length || 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[220px] md:h-[500px] w-full overflow-hidden bg-slate-900 group shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
          <img 
            src={slides[current].image} 
            className="w-full h-full object-cover"
            alt={slides[current].title}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-16 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`content-${current}`}
          transition={{ delay: 0.3 }}
        >
          <Badge className="bg-primary-500 text-white border-transparent px-3 py-1 sm:px-4 sm:py-1.5 font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-3 sm:mb-6">
            {slides[current].badge}
          </Badge>
          <h2 className="text-2xl md:text-6xl font-black text-white tracking-tight mb-2 sm:mb-4 leading-tight">{slides[current].title}</h2>
          <p className="text-sm md:text-xl text-slate-300 font-medium max-w-xl mb-8">{slides[current].subtitle}</p>
          
          <Link to="/residential">
            <Button 
              variant="outline"
              size="lg" 
              className="rounded-full px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-primary-500 hover:text-white border-none transition-all transform hover:scale-105" 
              rightIcon={<ArrowRight size={18} />}
            >
               Explore Inventory
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 right-10 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i ? 'bg-primary-500 w-10' : 'bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

import PropertyCard from '../components/common/PropertyCard';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Carousel */}
      <section className="-mx-4 md:-mx-6 lg:-mx-10">
        <BannerCarousel />
      </section>

      {/* Why Choose Us Section - Enhanced with Image */}
      <section className="px-4 py-12 border-b border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header Area */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
             <Badge className="bg-primary-50 text-primary-600 border-primary-100 px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                The Network Advantage
             </Badge>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Why Brokers Trust <span className="text-primary-600 font-black italic">Brokerpost</span>
             </h2>
             <p className="text-slate-500 font-medium text-lg leading-relaxed">
                We make networking easier, safer, and more profitable with expert-vetted inventories and real-time connectivity across the globe.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
             {/* Left: Key Stats */}
             <div className="grid grid-cols-3 lg:grid-cols-1 gap-6 text-center lg:text-right order-2 lg:order-1">
                {[
                   { val: '10k+', label: 'Brokers' },
                   { val: '5+ yrs', label: 'History' },
                   { val: '12+', label: 'Regions' }
                ].map((stat, i) => (
                   <div key={i} className="space-y-1">
                      <h4 className="text-3xl font-black text-slate-900 leading-none">{stat.val}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                   </div>
                ))}
             </div>

             {/* Center: Hero Image */}
             <div className="relative group order-1 lg:order-2">
                <div className="absolute -inset-8 bg-primary-100/30 rounded-full blur-[100px] group-hover:bg-primary-100/50 transition-all duration-700 -z-10" />
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
                   <img src={networkFeature} alt="Network Advantage" className="w-full aspect-square object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 hidden md:block animate-bounce-slow">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                         <p className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">Verified Hub</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Features */}
             <div className="grid grid-cols-1 gap-4 order-3">
                {[
                   { title: 'Verified Network', desc: 'Expert vetted inventory.', icon: <ShieldCheck size={16} /> },
                   { title: 'Smart Dashboard', desc: 'Seamless management.', icon: <LayoutTemplate size={16} /> },
                   { title: 'Real-time Help', desc: 'Real-time expert help.', icon: <Phone size={16} /> }
                ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/50 hover:bg-white transition-all duration-300 group/item border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm border border-slate-50 group-hover/item:scale-110 transition-transform">
                         {item.icon}
                      </div>
                      <div>
                         <h4 className="text-base font-black text-slate-900 leading-tight">{item.title}</h4>
                         <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.desc}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Main Post Grid */}
      <section className="space-y-8 px-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
           <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden ring-1 ring-slate-100">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                    </div>
                 ))}
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Premium Postings</h2>
                 <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-0.5">Verified & Shielded</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Filter</button>
              <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg">Newest</button>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {listings.map((item) => (
             <PropertyCard key={item.id} item={item} />
           ))}
        </div>

        <div className="pt-12 text-center">
           <Button variant="outline" size="lg" className="rounded-2xl border-slate-100 bg-white hover:bg-slate-50 text-slate-900 font-bold px-12 py-5 shadow-soft" rightIcon={<ArrowRight size={18} />}>
              Load More Network Listings
           </Button>
        </div>
      </section>

      {/* Specialty Sections: Commercial & Residential CTA */}
      <section className="space-y-12 lg:space-y-20 py-10 lg:py-20 bg-slate-50/50">
        {/* Commercial Section */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 text-center lg:text-left"
              >
                 <div className="space-y-3">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1.5 font-black uppercase tracking-widest text-[9px]">
                       Commercial Excellence
                    </Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                       Premium Offices & <span className="text-blue-600">Business Hubs</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                       Access exclusive corporate inventories from Grade-A office spaces to prime high-street retail locations across the globe.
                    </p>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
                    <Link to="/commercial" className="w-full sm:w-auto">
                       <Button size="lg" className="w-full sm:w-auto rounded-2xl px-10 py-5 bg-slate-900 text-white font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800">
                          Explore Commercial
                       </Button>
                    </Link>
                    <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                       View All Cities
                    </button>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group order-first lg:order-last"
              >
                 <div className="absolute -inset-6 bg-blue-100/50 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="aspect-[16/10] lg:aspect-[4/3] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 lg:border-8 border-white relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
                    <img src={commercialCta} alt="Commercial Real Estate" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 </div>
              </motion.div>
           </div>
        </div>

        {/* Residential Section */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                 <div className="absolute -inset-6 bg-primary-100/50 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="aspect-[16/10] lg:aspect-[4/3] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 lg:border-8 border-white relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
                    <img src={residentialCta} alt="Residential Real Estate" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 text-center lg:text-left"
              >
                 <div className="space-y-3">
                    <Badge className="bg-primary-50 text-primary-600 border-primary-100 px-4 py-1.5 font-black uppercase tracking-widest text-[9px]">
                       Luxury Living
                    </Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                       Discover Your Dream <span className="text-primary-600">Luxury Sky-Villa</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                       Experience redefined luxury with our handpicked collection of sky-villas, penthouses, and ultra-modern suburban homes.
                    </p>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
                    <Link to="/residential" className="w-full sm:w-auto">
                       <Button size="lg" className="w-full sm:w-auto rounded-2xl px-10 py-5 bg-primary-600 text-white font-bold shadow-xl shadow-primary-600/10 hover:bg-primary-700">
                          Explore Residential
                       </Button>
                    </Link>
                    <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                       Brokers Near Me
                    </button>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
