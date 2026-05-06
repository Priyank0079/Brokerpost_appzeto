import React from 'react';
import { Users, ShieldCheck, Handshake, LayoutGrid, Users2, Camera } from 'lucide-react';

const PlatformFeatures = () => {
  const features = [
    {
      title: 'Verified Broker Community',
      description: 'Every member is a verified professional broker. No public users, no fake listings — only genuine inventory from trusted sources.',
      icon: <ShieldCheck size={24} className="text-primary-500" />,
      bg: 'bg-primary-50'
    },
    {
      title: 'Zero Brokerage Platform',
      description: 'This platform does not charge any brokerage or commission. Brokers connect directly and settle their own terms — fair and transparent.',
      icon: <Handshake size={24} className="text-blue-500" />,
      bg: 'bg-blue-50'
    },
    {
      title: 'Direct Broker Deals',
      description: 'Connect one-on-one with the listing broker. Share requirements, discuss inventory, and close deals within the trusted community.',
      icon: <Users size={24} className="text-emerald-500" />,
      bg: 'bg-emerald-50'
    },
    {
      title: 'Structured Inventory',
      description: 'Listings are categorized precisely — Residential & Commercial, Available & Required, for Sale, Rent, Lease and more. No noise, just clarity.',
      icon: <LayoutGrid size={24} className="text-purple-500" />,
      bg: 'bg-purple-50'
    },
    {
      title: 'Broker Groups',
      description: "Admin can create groups by area, segment or network. Search your group's inventory separately for hyper-focused deal matching.",
      icon: <Users2 size={24} className="text-indigo-500" />,
      bg: 'bg-indigo-50'
    },
    {
      title: 'Photo & Video Listings',
      description: 'Upload images and videos with every listing. Give fellow brokers a real visual of the property before they connect.',
      icon: <Camera size={24} className="text-rose-500" />,
      bg: 'bg-rose-50'
    }
  ];

  return (
    <section id="features" className="bg-pink-50 pt-20 pb-28 px-6 lg:px-20">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#c8962a] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Platform Features
          </p>
          <h2 className="text-2xl lg:text-3xl font-serif text-[#0f172a] mb-4">
            Everything a Broker Needs
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Built exclusively for verified real estate professionals who believe in transparent, direct dealings.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-7 rounded-xl border border-slate-100">
              <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold text-[#0f172a] mb-1">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-[12px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
