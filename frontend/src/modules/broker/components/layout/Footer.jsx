import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
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
    <footer className="bg-transparent pt-16 pb-8 px-6 lg:px-10 text-slate-900 hidden lg:block border-t border-slate-100">
      <div className="max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Identity Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 group cursor-pointer w-fit">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform duration-500">
                <Building2 size={22} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                Brokers<span className="text-primary-600">post</span>
              </span>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed font-medium max-w-xs">
              The trusted network for real estate professionals. Connecting verified brokers with premium global inventories.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-100 bg-slate-50">
                 <ShieldCheck className="text-emerald-500" size={12} />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-100 bg-slate-50">
                 <Globe className="text-blue-500" size={12} />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Global Hubs</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Core Navigation</h4>
            <ul className="space-y-3">
              {['Marketplace', 'Broker Network', 'Intelligence', 'Recent Listings', 'Events'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors text-xs font-bold flex items-center group gap-2">
                    <span>{link}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Units */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Business Verticals</h4>
            <ul className="space-y-3">
              {['Commercial Estates', 'Luxury Residential', 'Industrial Plots', 'Retail Spaces', 'Investment Portfolios'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors text-xs font-bold flex items-center group gap-2">
                    <span>{link}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Support */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">Connect Globally</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                   <p className="text-xs font-bold text-slate-900">connect@brokerspost.net</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hotline</p>
                   <p className="text-xs font-bold text-slate-900">+91 800-BROKERS</p>
                </div>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
               {[Share2, Globe, Users, MessageSquare].map((Icon, i) => (
                 <button key={i} className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:bg-primary-600 hover:text-white text-slate-400 transition-all duration-300 flex items-center justify-center hover:-translate-y-1 shadow-sm">
                   <Icon size={14} />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            © {currentYear} Brokerspost Network Platform.
          </p>
          
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Ethics', 'SLA'].map((item) => (
              <button key={item} className="text-slate-400 hover:text-primary-600 text-[9px] font-bold uppercase tracking-widest transition-colors">
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
