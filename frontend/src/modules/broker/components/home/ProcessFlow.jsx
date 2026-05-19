import React from 'react';

const ProcessFlow = ({ config }) => {
  const steps = config?.steps || [
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
    <section id="how-it-works" className="bg-[#1a365d] py-16 px-6 lg:px-20 text-white">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="section-tag">
            {config?.badge || 'Process'}
          </p>
          <h2 className="section-title text-left" style={{ color: '#ffffff' }}>
            {config?.title || 'How BrokersPost Works'}
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            {config?.subtitle || 'Four simple steps to start sharing and closing deals with verified brokers.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps">
          {steps.map((step, idx) => (
            <div key={idx} className="step">
              <div className="step-num">
                {step.number}
              </div>
              <h3 className="step-title">
                {step.title}
              </h3>
              <p className="step-desc">
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
