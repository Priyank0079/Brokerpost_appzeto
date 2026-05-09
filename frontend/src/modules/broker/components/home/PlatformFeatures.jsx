import React from 'react';
import * as Icons from 'lucide-react';

const PlatformFeatures = ({ config }) => {
  const getIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.ShieldCheck;
    return <Icon size={24} />;
  };

  const features = config?.items || [
    {
      title: 'Verified Broker Community',
      description: 'Every member is a verified professional broker. No public users, no fake listings — only genuine inventory from trusted sources.',
      icon: 'ShieldCheck',
      color: 'bg-primary-50 text-primary-500'
    },
    {
      title: 'Zero Brokerage Platform',
      description: 'This platform does not charge any brokerage or commission. Brokers connect directly and settle their own terms — fair and transparent.',
      icon: 'Handshake',
      color: 'bg-blue-50 text-blue-500'
    }
  ];

  return (
    <section id="features" className="bg-pink-50 pt-20 pb-28 px-6 lg:px-20">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#c8962a] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            {config?.badge || 'Platform Features'}
          </p>
          <h2 className="text-2xl lg:text-3xl font-serif text-[#0f172a] mb-4">
            {config?.title || 'Everything a Broker Needs'}
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            {config?.subtitle || 'Built exclusively for verified real estate professionals who believe in transparent, direct dealings.'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-7 rounded-xl border border-slate-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.color || 'bg-primary-50 text-primary-500'}`}>
                {getIcon(feature.icon)}
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
