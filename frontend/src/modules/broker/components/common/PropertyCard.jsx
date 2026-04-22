import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Eye, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const PropertyCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (item.video && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(e => console.log("Video play failed", e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, item.video]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full"
    >
      <Link to={`/property/${item.id}`} className="block h-full cursor-pointer">
        <Card className="overflow-hidden border-none shadow-soft h-full flex flex-col transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            {item.video ? (
              <>
                <video
                  ref={videoRef}
                  src={item.video}
                  muted
                  loop
                  playsInline
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                />
                <img 
                  src={item.image} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                  alt={item.title}
                />
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <Badge variant="success" className="bg-emerald-500/90 backdrop-blur-sm text-white border-transparent px-2 py-0.5 font-bold uppercase text-[9px] tracking-widest">
                    Verified
                  </Badge>
                </div>
                {!isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Play size={20} className="fill-current" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img 
                src={item.image} 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" 
                alt={item.title}
              />
            )}

            {/* Location Badge Over Image */}
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                  <MapPin className="text-primary-400" size={12} />
                  <span className="text-[10px] font-bold text-white tracking-wide">{item.location?.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="font-extrabold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-slate-100">
                {item.type}
              </Badge>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.vertical}</span>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-4 text-slate-400 mb-6">
              <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span className="text-[11px] font-bold">2h ago</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <Eye size={12} />
                  <span className="text-[11px] font-bold">1.2k</span>
              </div>
            </div>

            <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Asking Price</p>
                <p className="text-xl font-black text-slate-900 leading-none">
                  ₹{item.price > 0 ? (item.price >= 10000000 ? `${(item.price / 10000000).toFixed(2)} Cr` : `${(item.price / 100000).toFixed(2)} L`) : 'Contact'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
