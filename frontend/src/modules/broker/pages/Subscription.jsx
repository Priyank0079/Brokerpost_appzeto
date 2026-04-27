import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Check, Zap, ShieldCheck, Crown, ArrowRight, Star } from 'lucide-react';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('Professional');

  const plans = [
    {
      name: 'Starter',
      price: '0',
      description: 'Ideal for independent brokers.',
      features: ['Up to 5 active listings', 'Standard visibility', 'Email support', 'Basic analytics'],
      buttonIcon: null,
      highlight: false,
      color: 'slate'
    },
    {
      name: 'Professional',
      price: '99',
      description: 'Perfect for active brokers.',
      features: ['Unlimited listings', 'Priority visibility', 'Verified badge', 'Network access', 'Advanced analytics'],
      buttonIcon: <Zap size={14} />,
      highlight: true,
      color: 'primary'
    },
    {
      name: 'Enterprise',
      price: '499',
      description: 'For large agencies.',
      features: ['Everything in Pro', 'Dedicated manager', 'API access', 'Custom branding', 'Bulk imports'],
      buttonIcon: <Crown size={14} />,
      highlight: false,
      color: 'slate'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-6">
      {/* Compact Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <Badge variant="primary" className="px-3 py-1 font-bold uppercase tracking-widest text-[9px] mb-1">Elevate Your Presence</Badge>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Simple Pricing, <span className="text-primary-600">Powerful Network</span></h1>
        <p className="text-slate-500 font-medium text-xs">Choose the partner plan that best fits your business goals.</p>
      </div>

      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative group transition-all duration-500 ${plan.highlight ? 'md:-mt-2 md:mb-2' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                 <span className="bg-primary-600 text-white text-[9px] font-bold uppercase tracking-[1.5px] px-3 py-1 rounded-full shadow-lg shadow-primary-600/20 ring-4 ring-white">Most Popular</span>
              </div>
            )}

            <Card 
              noPadding 
              className={`h-full border border-slate-200 transition-all duration-500 overflow-hidden rounded-2xl ${plan.highlight ? 'border-primary-600 shadow-2xl shadow-primary-600/10 scale-[1.01]' : 'hover:border-primary-200 shadow-sm shadow-slate-200/20'}`}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4">
                   <h3 className="text-lg font-black text-slate-900 leading-none">{plan.name}</h3>
                   <p className="text-[11px] font-medium text-slate-400 mt-2">{plan.description}</p>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                   <span className="text-xs font-bold text-slate-400">₹</span>
                   <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                   <span className="text-xs font-bold text-slate-400">/mo</span>
                </div>

                <div className="space-y-3 flex-1">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Included Features</p>
                   {plan.features.map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Check size={10} strokeWidth={4} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-600">{feature}</span>
                     </div>
                   ))}
                </div>

                <div className="mt-8">
                   <Button 
                      variant={plan.highlight ? 'primary' : 'outline'} 
                      fullWidth 
                      onClick={() => alert(`Redirecting to ${plan.name} payment...`)}
                      className={`font-bold uppercase tracking-widest text-[10px] py-3.5 rounded-xl transition-all ${plan.highlight ? 'shadow-lg shadow-primary-600/20 active:scale-95' : 'border-slate-200 hover:bg-slate-50'}`}
                      leftIcon={plan.buttonIcon}
                   >
                      Upgrade {plan.name}
                   </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Trust Quote / Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mt-12 relative overflow-hidden">
         <div className="space-y-1 relative z-10 text-center md:text-left">
            <h4 className="text-lg font-bold tracking-tight">Need an Enterprise solution?</h4>
            <p className="text-xs font-medium text-slate-400">Custom plans for agencies with 50+ active brokers.</p>
         </div>
         <button className="bg-white text-slate-900 font-bold uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl hover:bg-primary-50 transition-all relative z-10">Contact Sales</button>
         <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};

export default Subscription;
