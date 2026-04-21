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
      description: 'Ideal for independent brokers starting out.',
      features: ['Up to 5 active listings', 'Standard visibility', 'Email support', 'Basic analytics'],
      buttonIcon: null,
      highlight: false,
      color: 'slate'
    },
    {
      name: 'Professional',
      price: '99',
      description: 'Perfect for active brokers scaling their business.',
      features: ['Unlimited listings', 'Priority visibility', 'Verified badge', 'Network access', 'Advanced analytics'],
      buttonIcon: <Zap size={16} />,
      highlight: true,
      color: 'primary'
    },
    {
      name: 'Enterprise',
      price: '499',
      description: 'For large agencies requiring maximum reach.',
      features: ['Everything in Pro', 'Dedicated manager', 'API access', 'Custom branding', 'Bulk imports'],
      buttonIcon: <Crown size={16} />,
      highlight: false,
      color: 'slate'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in py-6">
      {/* Compact Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px] mb-2">Elevate Your Presence</Badge>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Simple Pricing, <span className="text-primary-600">Powerful Network</span></h1>
        <p className="text-slate-500 font-medium text-sm">Choose the partner plan that best fits your business goals. All plans include full access to our verified broker global network.</p>
      </div>

      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative group transition-all duration-500 ${plan.highlight ? 'md:-mt-4 md:mb-4' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                 <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-[2px] px-4 py-1.5 rounded-full shadow-lg shadow-primary-600/30 ring-4 ring-white">Most Popular</span>
              </div>
            )}

            <Card 
              noPadding 
              className={`h-full border-2 transition-all duration-500 overflow-hidden ${plan.highlight ? 'border-primary-600 shadow-2xl shadow-primary-600/10 scale-[1.02]' : 'border-slate-100 hover:border-primary-200 shadow-xl shadow-slate-200/20'}`}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="mb-6">
                   <h3 className="text-xl font-black text-slate-900 leading-none">{plan.name}</h3>
                   <p className="text-xs font-medium text-slate-400 mt-2 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                   <span className="text-sm font-black text-slate-400">₹</span>
                   <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                   <span className="text-sm font-bold text-slate-400">/mo</span>
                </div>

                <div className="space-y-4 flex-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What's Included</p>
                   {plan.features.map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' : 'bg-slate-100 text-slate-400'}`}>
                           <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">{feature}</span>
                     </div>
                   ))}
                </div>

                <div className="mt-10">
                   <Button 
                      variant={plan.highlight ? 'primary' : 'outline'} 
                      fullWidth 
                      onClick={() => alert(`Redirecting to ${plan.name} payment gateway...`)}
                      className={`font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl shadow-lg transition-all ${plan.highlight ? 'shadow-primary-600/20 active:scale-95' : 'border-slate-200 hover:bg-slate-50'}`}
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
      <div className="bg-slate-50 border border-slate-100 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 mt-16 relative overflow-hidden">
         <div className="space-y-2 relative z-10 text-center md:text-left">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Need a custom enterprise solution?</h4>
            <p className="text-sm font-medium text-slate-500">For agencies with 50+ brokers, contact our partner relationships team.</p>
         </div>
         <Button variant="ghost" className="font-black text-primary-600 uppercase tracking-widest text-[11px] hover:bg-white px-10 py-4 shadow-sm relative z-10" rightIcon={<ArrowRight size={18} />}>Contact Sales</Button>
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};

export default Subscription;
