import React from 'react';
import HomeInventorySection from '../components/home/HomeInventorySection';
import SearchPhilosophy from '../components/home/SearchPhilosophy';
import HowItWorks from '../components/home/HowItWorks';
import CampaignProgress from '../components/home/CampaignProgress';
import TheMathSection from '../components/home/TheMathSection';
import ComparisonSection from '../components/home/ComparisonSection';
import BrokerBenefits from '../components/home/BrokerBenefits';
import NetworkEffect from '../components/home/NetworkEffect';
import FoundingMember from '../components/home/FoundingMember';
import FAQ from '../components/home/FAQ';

const Home = () => {
  return (
    <div className="pb-20 bg-[#F8FAFC]">
      {/* 
          Main Dashboard Section 
          Contains: 
          1. Header Area (Branding, Notifications, Profile)
          2. Search & Tabs
          3. Dynamic Banner (Broker Registration Content)
          4. Inventory Table
      */}
      <section>
        <HomeInventorySection />
      </section>

      <SearchPhilosophy />

      <ComparisonSection />

      <HowItWorks />

      <CampaignProgress />

      <TheMathSection />

      <BrokerBenefits />

      <NetworkEffect />

      <FAQ />

      <FoundingMember />

    </div>
  );
};

export default Home;
