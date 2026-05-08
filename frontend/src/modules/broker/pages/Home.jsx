import React from 'react';
import SearchPhilosophy from '../components/home/SearchPhilosophy';
import HowItWorks from '../components/home/HowItWorks';
import CampaignProgress from '../components/home/CampaignProgress';
import TheMathSection from '../components/home/TheMathSection';
import ComparisonSection from '../components/home/ComparisonSection';
import BrokerBenefits from '../components/home/BrokerBenefits';
import NetworkEffect from '../components/home/NetworkEffect';
import FoundingMember from '../components/home/FoundingMember';
import FAQ from '../components/home/FAQ';
import LandingNavbar from '../components/home/LandingNavbar';
import LandingHero from '../components/home/LandingHero';
import LandingSearch from '../components/home/LandingSearch';
import InventoryGrid from '../components/home/InventoryGrid';
import PlatformFeatures from '../components/home/PlatformFeatures';
import ProcessFlow from '../components/home/ProcessFlow';
import CTASection from '../components/home/CTASection';
import LandingFooter from '../components/home/LandingFooter';

import { useLandingConfig } from '../../../hooks/useLandingConfig';

const Home = () => {
  const { config, loading, error } = useLandingConfig();
  const [filters, setFilters] = React.useState({
    vertical: '',
    location: '',
    intent: '',
    subType: '',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8962a]"></div>
    </div>
  );

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error || 'Failed to load configuration'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#c8962a] text-white rounded-lg hover:bg-[#b08425] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { sections } = config;

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <LandingNavbar />
      
      <LandingHero />
      
      <LandingSearch filters={filters} onFilterChange={setFilters} />
      
      <InventoryGrid filters={filters} />
      
      <PlatformFeatures />
      
      <ProcessFlow />
      
      <CTASection />
      
      <LandingFooter />

    </div>
  );
};

export default Home;
