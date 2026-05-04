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

import { useLandingConfig } from '../../../hooks/useLandingConfig';

const Home = () => {
  const { config, loading } = useLandingConfig();

  if (loading) return null; // Or a loader if preferred

  const { sections } = config;

  return (
    <div className="pb-20 bg-[#F8FAFC]">
      <section>
        <HomeInventorySection data={sections.hero} />
      </section>

      {sections.searchPhilosophy?.visible && <SearchPhilosophy data={sections.searchPhilosophy} />}

      {sections.comparison?.visible && <ComparisonSection data={sections.comparison} />}

      {sections.howItWorks?.visible && <HowItWorks data={sections.howItWorks} />}

      {sections.campaignProgress?.visible && (
        <CampaignProgress data={sections.campaignProgress} />
      )}

      {sections.theMath?.visible && <TheMathSection data={sections.theMath} />}

      {sections.brokerBenefits?.visible && <BrokerBenefits data={sections.brokerBenefits} />}

      {sections.networkEffect?.visible && <NetworkEffect data={sections.networkEffect} />}

      {sections.faqs?.visible && <FAQ data={sections.faqs} />}

      {sections.foundingMember?.visible && (
        <FoundingMember data={sections.foundingMember} />
      )}

    </div>
  );
};

export default Home;
