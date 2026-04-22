import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight,
  Globe,
  ShieldCheck,
  Share2,
  Users,
  MessageSquare
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 pt-20 pb-10 px-6 lg:px-10 text-white hidden lg:block">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Identity Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 group cursor-pointer w-fit">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-500">
                <Building2 size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                Broker<span className="text-primary-500">post</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              The world's most trusted network for real estate professionals. Connecting verified brokers with premium global inventories through state-of-the-art connectivity.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-800/50">
                 <ShieldCheck className="text-emerald-500" size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-800/50">
                 <Globe className="text-blue-500" size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Global Hubs</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary-500">Core Navigation</h4>
            <ul className="space-y-4">
              {['Marketplace', 'Broker Network', 'Intelligence', 'Recent Listings', 'Events'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group gap-2">
                    <span>{link}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Units */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary-500">Business Verticals</h4>
            <ul className="space-y-4">
              {['Commercial Estates', 'Luxury Residential', 'Industrial Plots', 'Retail Spaces', 'Investment Portfolios'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group gap-2">
                    <span>{link}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Support */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary-500">Connect Globally</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Corporate Email</p>
                   <p className="text-sm font-bold text-white">connect@brokerpost.net</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Hotline</p>
                   <p className="text-sm font-bold text-white">+91 800-BROKER-POST</p>
                </div>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-4">
               {[Share2, Globe, Users, MessageSquare].map((Icon, i) => (
                 <button key={i} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-400 transition-all duration-300 flex items-center justify-center hover:-translate-y-1 shadow-lg">
                   <Icon size={18} />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-xs font-bold">
              © {currentYear} Brokerpost Network Platform. Crafted for Excellence.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            {['Privacy Protocol', 'Service Terms', 'Broker Ethics', 'Cloud SLA'].map((item) => (
              <button key={item} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
