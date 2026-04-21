import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Phone, Info, Bookmark, Share2, MapPin, Building, User } from 'lucide-react';
import { listings } from '../../data/listings';

const FeedList = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      {/* Search & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 sticky top-16 bg-background/80 backdrop-blur-md z-20">
        <div className="flex gap-6">
          <button className="text-sm font-bold text-primary-600 border-b-2 border-primary-600 pb-4 mt-4 transition-all">All Posts</button>
          <button className="text-sm font-medium text-slate-500 pb-4 mt-4 hover:text-slate-900 transition-all">My Network</button>
          <button className="text-sm font-medium text-slate-500 pb-4 mt-4 hover:text-slate-900 transition-all">Saved</button>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Info size={14} />}>Rules</Button>
      </div>

      {/* Feed content */}
      <div className="flex flex-col gap-8">
        {listings.map((item) => (
          <Card key={item.id} noPadding className="group hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">{item.broker}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                       <Building size={10} /> 
                       Luxury Realtors Network • 2h ago
                    </p>
                  </div>
               </div>
               <Badge variant={item.type === 'Residential' ? 'primary' : 'dark'}>
                  {item.type}
               </Badge>
            </div>

            {/* Content Image */}
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
               <img 
                 src={item.image} 
                 alt={item.title} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge variant="accent" className="bg-white/90 backdrop-blur-sm text-amber-600 border-none shadow-sm capitalize">
                     {item.status}
                  </Badge>
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/80 to-transparent">
                  <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                  <p className="text-slate-200 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} className="text-primary-400" />
                    {item.location}
                  </p>
               </div>
            </div>

            {/* Info Body */}
            <div className="p-5">
               <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-black text-slate-900">₹{(item.price / 1000000).toFixed(1)} Cr</span>
                    <span className="text-xs text-slate-400 ml-2">({item.sqft} sq.ft)</span>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1 font-bold">SALE</Badge>
               </div>
               
               <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  Beautiful premium {item.category} located in the heart of {item.location}. 
                  Ideal for families looking for ready to move property with all modern amenities.
                  Negotiations possible for immediate closure.
               </p>

               {/* Tags */}
               <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">#{tag.replace(/\s/g, '')}</span>
                  ))}
               </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
               <div className="flex items-center gap-1">
                  <Button variant="primary" size="sm" className="rounded-full px-5" leftIcon={<Phone size={14} />}>
                    Call Broker
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-5">
                    View Details
                  </Button>
               </div>
               <div className="flex items-center gap-4">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Bookmark size={20} />
                  </button>
                  <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Share2 size={20} />
                  </button>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedList;
