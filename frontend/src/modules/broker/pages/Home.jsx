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
    <div className="relative h-[180px] md:h-[380px] w-full overflow-hidden bg-slate-900 group shadow-2xl">
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

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-10 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`content-${current}`}
          transition={{ delay: 0.3 }}
        >
          <Badge className="bg-primary-500 text-white border-transparent px-3 py-1 sm:px-4 sm:py-1 font-black uppercase tracking-widest text-[8px] sm:text-[9px] mb-2 sm:mb-4">
            {slides[current].badge}
          </Badge>
          <h2 className="text-xl md:text-5xl font-black text-white tracking-tight mb-1 sm:mb-2 leading-tight">{slides[current].title}</h2>
          <p className="text-xs md:text-lg text-slate-300 font-medium max-w-xl mb-4 md:mb-6">{slides[current].subtitle}</p>
          
          <Link to="/residential">
            <Button 
              variant="outline"
              size="sm" 
              className="rounded-full px-8 py-3 bg-white text-slate-900 font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl hover:bg-primary-500 hover:text-white border-none transition-all transform hover:scale-105" 
              rightIcon={<ArrowRight size={14} />}
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
import HomeInventorySection from '../components/home/HomeInventorySection';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="pb-20">
      {/* CRM Inventory Section */}
      <section>
        <HomeInventorySection />
      </section>

      {/* Hero Carousel */}
      <section>
        <BannerCarousel />
      </section>

      {/* Main Post Grid */}
      <section className="space-y-8 px-4 mt-12">
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

    </div>
  );
};

export default Home;
