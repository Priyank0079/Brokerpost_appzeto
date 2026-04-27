import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { listings } from '../data/listings';
import PropertyCard from '../components/common/PropertyCard';
import HomeInventorySection from '../components/home/HomeInventorySection';
import SearchPhilosophy from '../components/home/SearchPhilosophy';
import HowItWorks from '../components/home/HowItWorks';
import ComparisonSection from '../components/home/ComparisonSection';
import BrokerBenefits from '../components/home/BrokerBenefits';
import NetworkEffect from '../components/home/NetworkEffect';
import FoundingMember from '../components/home/FoundingMember';
import FAQ from '../components/home/FAQ';

const Home = () => {
  const { user } = useAuth();

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

      <BrokerBenefits />

      <NetworkEffect />

      <FAQ />

      <FoundingMember />

    </div>
  );
};

export default Home;
