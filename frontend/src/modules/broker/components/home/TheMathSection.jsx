import React from 'react';
import { LineChart, Target } from 'lucide-react';

const cards = [
  {
    accent: '#f97373',
    icon: '#f97373',
    brokers: '20 Brokers',
    listings: '300 Listings',
    requirements: '100 Requirements',
    badge: 'Match Probability: LOW',
    badgeClass: 'bg-rose-500 text-white',
    description: 'Too fragmented. Not enough density in any micro-market.',
  },
  {
    accent: '#fb923c',
    icon: '#f97316',
    brokers: '50 Brokers',
    listings: '750 Listings',
    requirements: '250 Requirements',
    badge: 'Match Probability: MEDIUM',
    badgeClass: 'bg-amber-400 text-white',
    description: 'Some micro-markets have critical mass. Getting there.',
  },
  {
    accent: '#4ade80',
    icon: '#22c55e',
    brokers: '100 Brokers',
    listings: '1,500 Listings',
    requirements: '500 Requirements',
    badge: 'Match Probability: HIGH',
    badgeClass: 'bg-emerald-600 text-white',
    description: 'Every major micro-market has density. Platform takes off!',
    featured: true,
  },
];

const TheMathSection = () => {
  return (
    <section className="bg-[#f8fafc] px-4 py-10 md:px-6 md:py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <h2 className="text-[28px] md:text-[44px] font-black tracking-tight text-slate-950 leading-tight">
            The Math: Why 100 Brokers Changes Everything
          </h2>
          <p className="mt-2.5 text-[15px] md:text-[18px] font-medium text-slate-500">
            Network density = Match probability
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          {cards.map((card) => (
            <article
              key={card.brokers}
              className={[
                'relative overflow-hidden rounded-[24px] bg-white px-5 py-7 text-center shadow-[0_14px_36px_rgba(15,23,42,0.08)]',
                'border border-slate-100',
                card.featured ? 'lg:scale-[1.01]' : '',
              ].join(' ')}
            >
              <div
                className="absolute left-0 top-0 h-full w-[4px] rounded-r-full"
                style={{ backgroundColor: card.accent }}
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-5xl">
                {card.featured ? (
                  <Target size={34} strokeWidth={2.4} color={card.icon} />
                ) : (
                  <LineChart size={34} strokeWidth={2.4} color={card.icon} />
                )}
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-[18px] md:text-[20px] font-medium text-slate-900">
                  {card.brokers}
                </h3>
                <div className="text-[34px] md:text-[42px] font-light tracking-tight text-slate-900 leading-none">
                  {card.listings}
                </div>
                <p className="text-[15px] md:text-[17px] font-medium text-slate-900">
                  {card.requirements}
                </p>
              </div>

              <div className="mt-5 flex justify-center">
                <span className={`inline-flex rounded-full px-3 py-1.5 text-[12px] md:text-[13px] font-bold ${card.badgeClass}`}>
                  {card.badge}
                </span>
              </div>

              <p className="mx-auto mt-5 max-w-[280px] text-[13px] md:text-[14px] font-normal leading-relaxed text-slate-600">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheMathSection;
