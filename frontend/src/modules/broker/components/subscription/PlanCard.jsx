import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';
import { subscriptions } from '../../data/subscriptions';

const PlanCard = () => {
  return (
    <div className="space-y-12 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Simple Pricing, <span className="text-primary-600">Powerful Network</span></h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Choose the plan that fits your business. All plans include access to our global broker network and primary features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {subscriptions.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col relative ${plan.recommended ? 'border-primary-500 ring-4 ring-primary-500/10 scale-105 z-10' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant="primary" className="px-4 py-1 text-xs font-bold uppercase tracking-widest shadow-lg">Most Popular</Badge>
              </div>
            )}
            
            <div className="text-center space-y-2 mb-8">
               <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
               <div className="flex items-center justify-center gap-1">
                 <span className="text-sm font-bold text-slate-400">₹</span>
                 <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                 <span className="text-sm text-slate-400">/mo</span>
               </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
               {plan.features.map((feature, i) => (
                 <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-primary-600 flex-shrink-0 mt-0.5">
                       <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 leading-tight">{feature}</span>
                 </div>
               ))}
            </div>

            <Button 
              variant={plan.recommended ? 'primary' : 'outline'} 
              className="w-full py-4 text-xs font-bold uppercase tracking-widest"
              rightIcon={plan.recommended ? <Zap size={14} fill="currentColor" /> : null}
            >
              {plan.price === 0 ? 'Start for Free' : 'Upgrade Now'}
            </Button>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-20">
         <Card className="bg-slate-900 border-none">
            <div className="flex flex-col md:flex-row items-center gap-10 p-4">
               <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-primary-500/40">
                  <Building2 size={40} />
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h4 className="text-2xl font-bold text-white mb-2">Need a Custom Team Plan?</h4>
                  <p className="text-slate-400 text-sm">For large real estate agencies with more than 50 agents, we offer custom enterprise solutions with dedicated portal and advanced analytics.</p>
               </div>
               <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 shrink-0">
                  Contact Sales
               </Button>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default PlanCard;
