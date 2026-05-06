import React from 'react';

const ProcessFlow = () => {
  const steps = [
    {
      number: '01',
      title: 'Register & Get Verified',
      description: 'Submit your broker details. Your account is activated instantly — start posting and browsing inventory right away.'
    },
    {
      number: '02',
      title: 'Post Your Inventory',
      description: 'Add available properties or client requirements. Upload photos, videos, pricing and all relevant details.'
    },
    {
      number: '03',
      title: 'Search & Discover',
      description: 'Browse live listings by location, type, budget. Use group filters to find inventory within your trusted circle.'
    },
    {
      number: '04',
      title: 'Connect & Deal',
      description: 'Click to connect with the listing broker. Exchange details and close deals — no platform in between.'
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#1a365d] py-10 px-6 lg:px-20 text-white">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[#c8962a] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Process
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif mb-4">
            How BrokersPost Works
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Four simple steps to start sharing and closing deals with verified brokers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="group">
              <span className="text-[#c8962a] text-4xl font-serif font-bold mb-6 block opacity-80 group-hover:opacity-100 transition-opacity">
                {step.number}
              </span>
              <h3 className="text-lg font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-slate-400 text-[13px] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
