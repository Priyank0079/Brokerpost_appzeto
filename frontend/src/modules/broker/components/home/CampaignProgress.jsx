import React from 'react';
import { Target } from 'lucide-react';

const brokerProgress = {
  current: 47,
  total: 100,
  label: 'Brokers Joined',
  gradient: 'linear-gradient(90deg, #5b6df0 0%, #7c4faf 100%)',
};

const listingProgress = {
  current: 705,
  total: 1500,
  label: 'Listings',
  gradient: 'linear-gradient(90deg, #48c27d 0%, #36a96d 100%)',
};

const CampaignProgress = () => {
  const brokerPercent = (brokerProgress.current / brokerProgress.total) * 100;
  const listingPercent = (listingProgress.current / listingProgress.total) * 100;

  return (
    <section className="py-12 px-4 bg-[#f8fafc]">
      <div className="max-w-[1600px] mx-auto">
        <div className="rounded-[28px] bg-[#fbfcfe] border border-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.04)] px-6 py-10 md:px-10 md:py-12 lg:px-12">
          <div className="max-w-[1500px] mx-auto">
            <div className="flex flex-col items-center justify-center text-center gap-3 mb-8">
              <div className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 shadow-sm">
                  <Target size={20} strokeWidth={2.4} />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-950">
                  Campaign Progress
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative h-10 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="relative flex h-full items-center justify-center rounded-full text-white shadow-sm"
                  style={{ width: `${brokerPercent}%`, background: brokerProgress.gradient }}
                >
                  <span className="text-[16px] md:text-[18px] font-extrabold leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
                    {brokerProgress.current}/{brokerProgress.total} {brokerProgress.label}
                  </span>
                </div>
              </div>

              <div className="relative h-10 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="relative flex h-full items-center justify-center rounded-full text-white shadow-sm"
                  style={{ width: `${listingPercent}%`, background: listingProgress.gradient }}
                >
                  <span className="text-[16px] md:text-[18px] font-extrabold leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
                    {listingProgress.current}/{listingProgress.total} {listingProgress.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center space-y-1.5">
              <p className="text-[20px] md:text-[22px] font-extrabold text-slate-950 tracking-tight">
                {brokerProgress.total - brokerProgress.current} more brokers needed to reach{' '}
                <span className="uppercase">Critical Mass!</span>
              </p>
              <p className="text-[18px] md:text-[20px] font-medium text-slate-900">
                Join now and be a Founding Member.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignProgress;
