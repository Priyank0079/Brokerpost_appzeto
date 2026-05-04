const LandingPageConfig = require('../models/LandingPageConfig');

// @desc    Get landing page config
// @route   GET /api/v1/landing-config
// @access  Public
exports.getLandingConfig = async (req, res) => {
  try {
    let config = await LandingPageConfig.findOne();
    
    // If no config exists, create default one
    if (!config) {
      config = await LandingPageConfig.create({
        sections: {
          hero: {
            title: "Inventory Management",
            subtitle: "Real-time property network and CRM sync"
          },
          searchPhilosophy: { 
            visible: true,
            title: "Search-Based. No Algorithm. Pure Matching.",
            subtitle: "Unlike social media where posts get buried, Brokerspost is search-first. Connect directly with high-intent buyers without algorithmic interference.",
            features: [
              { title: 'Equal Visibility', color: 'primary', desc: ['No algorithm bias.', 'Every listing gets equal exposure.'] },
              { title: 'Match Probability', color: 'emerald', desc: ['More listings = Higher match rate.', 'Direct inventory-demand connection.'] },
              { title: 'Network Effect', color: 'blue', desc: ['Everyone wins as the network grows.', 'Power of a collective verified network.'] }
            ],
            matchingTitle: "How Pure Matching Works",
            matchingSubtitle: "Our system operates on high-intent search queries that connect inventory directly to demand without interference.",
            matchingBadge: "Guaranteed visibility for matching criteria.",
            badgeText: "The Network Philosophy",
            liveNetworkQueryLabel: "Live Network Query",
            liveNetworkQueryExample: "\"3 BHK + Sector 45 + Below ₹1.5 Cr\"",
            instantMatchLabel: "Instant Match",
            instantMatchStats: "Found 12 properties from 8 verified brokers"
          },
          comparison: { 
            visible: true,
            badge: "The Ultimate Upgrade",
            title: "Why Professionals Choose Brokerspost",
            subtitle: "We've redesigned real estate networking from the ground up, moving away from noisy feeds to high-intent matching.",
            benefits: [
              { title: 'Pure Matching', desc: 'Search results based 100% on inventory match.', color: 'emerald' },
              { title: 'Search-First Logic', desc: 'Instantly find exactly what matches your requirement.', color: 'blue' },
              { title: 'Verified Only', desc: 'Connect exclusively with RERA-verified professionals.', color: 'primary' },
              { title: 'No Feed Noise', desc: 'No algorithm bias. Your listings always get visibility.', color: 'emerald' }
            ],
            activeBrokers: "2.5k+"
          },
          howItWorks: { 
            visible: true,
            title: "How Brokerspost Works",
            subtitle: "Streamlined for Professional Success",
            steps: [
              { title: "Register Free", description: "Create your profile in 2 minutes. No credit card required.", color: "blue" },
              { title: "Post Listings", description: "Add inventory OR requirements. Fast & easy posting.", color: "indigo" },
              { title: "Search & Match", description: "Enter what you need. Get instant matching results.", color: "purple" },
              { title: "Collaborate", description: "Contact matched brokers and close deals together.", color: "emerald" }
            ]
          },
          campaignProgress: {
            visible: true,
            title: "Platform Velocity",
            subtitle: "Tracking our journey towards the network effect. Be part of the ecosystem that's redefining broker collaboration.",
            brokersCurrent: 47,
            brokersTotal: 100,
            listingsCurrent: 705,
            listingsTotal: 1500,
            badgeText: "Growth Milestone",
            footerTitle: "Join now and secure your status as a Founding Member.",
            footerSubtitle: "Early access ends once milestones are achieved."
          },
          theMath: { 
            visible: true,
            title: "The Math: Why 100 Brokers Changes Everything",
            subtitle: "Network density = Match probability",
            cards: [
              { brokers: '20 Brokers', listings: '300 Listings', requirements: '100 Requirements', badge: 'Match Probability: LOW', badgeClass: 'bg-rose-500 text-white', description: 'Too fragmented. Not enough density in any micro-market.', accent: '#f97373', iconColor: '#f97373' },
              { brokers: '50 Brokers', listings: '750 Listings', requirements: '250 Requirements', badge: 'Match Probability: MEDIUM', badgeClass: 'bg-amber-400 text-white', description: 'Some micro-markets have critical mass. Getting there.', accent: '#fb923c', iconColor: '#f97316' },
              { brokers: '100 Brokers', listings: '1,500 Listings', requirements: '500 Requirements', badge: 'Match Probability: HIGH', badgeClass: 'bg-emerald-600 text-white', description: 'Every major micro-market has density. Platform takes off!', accent: '#4ade80', iconColor: '#22c55e', featured: true }
            ]
          },
          brokerBenefits: { 
            visible: true,
            title: "How Different Brokers Benefit",
            subtitle: "Tailored advantages for every professional profile.",
            benefits: [
              { title: "Inventory Heavy", description: "Find matching requirements faster. Close 3-4 extra deals/month.", color: "blue" },
              { title: "Requirement Rich", description: "Get fresh inventory matches daily. Save 20+ hours searching.", color: "emerald" },
              { title: "New Broker", description: "Build network from day one. Connect with 50+ established brokers.", color: "amber" },
              { title: "Niche Specialist", description: "Find exact property matches. 5x higher match rate in your specialty.", color: "indigo" }
            ]
          },
          networkEffect: {
            visible: true,
            title: "The Network Effect: Everyone Wins Together",
            subtitle: "As the network grows, the value for every broker increases. Our matching engine thrives on collective intelligence.",
            points: [
              { id: 1, text: "You join", result: "Post 15 listings" },
              { id: 2, text: "99 others join", result: "1,500 total listings" },
              { id: 3, text: "Critical mass achieved", result: "Match probability hits 90%" },
              { id: 4, text: "More brokers join", result: "Seen by the entire network" },
              { id: 5, text: "YOU WIN", result: "More deals, more commissions" }
            ],
            testimonial: {
              quote: "Joined when there were 50 brokers. Closed my first co-broking deal worth ₹85 Lakhs within 2 weeks!",
              author: "Rajesh Sharma",
              location: "Founding Member, Gurgaon",
              avatar: "https://i.pravatar.cc/150?u=rajesh",
              successRate: "94.2%"
            }
          },
          foundingMember: {
            visible: true,
            title: "Be a Founding Member",
            subtitle: "The first 100 brokers get exclusive lifetime benefits.",
            slotsRemaining: 53,
            benefits: [
              "Free Lifetime Membership",
              "25 Free Listings",
              "Founding Member Badge",
              "Priority Support",
              "3 Months Featured Listings",
              "Early Access to Features",
              "Direct Intro to 20+ Brokers",
              "Lifetime 10% Discount"
            ],
            ctaText: "Join Now — Completely Free",
            footerNote: "No credit card required • No commitment • Cancel anytime"
          },
          faqs: {
            visible: true,
            title: "Frequently Asked Questions",
            subtitle: "Concerns",
            items: [
              {
                question: "How is Brokerspost different from WhatsApp groups?",
                answer: "Unlike WhatsApp where messages get buried, Brokerspost is search-first. You can find exactly what you need in seconds, and your listings are always discoverable by those who match your criteria."
              },
              {
                question: "Is it really free for the first 100 brokers?",
                answer: "Yes! The first 100 brokers get Lifetime Free access as part of our Founding Member program. No hidden fees, ever."
              },
              {
                question: "How do I know the other brokers are verified?",
                answer: "We verify every professional on our platform through RERA registrations and business credentials to ensure you only collaborate with legitimate experts."
              }
            ],
            footerText: "Still have questions? Connect with us"
          },
          navbar: {
            links: [
              { label: "Marketplace", url: "/inventory" },
              { label: "Network", url: "/network" }
            ]
          },
          contact: {
            email: "connect@brokerspost.net",
            phone: "+91 800-BROKERS",
            whatsapp: "910000000000",
            address: "Gurgaon, India"
          },
          footer: {
            brandingDesc: "The trusted network for real estate professionals. Connecting verified brokers with premium global inventories.",
            certifications: [
              { label: "ISO Certified", icon: "ShieldCheck" },
              { label: "Global Hubs", icon: "Globe" }
            ],
            navigation: [
              {
                title: "Core Navigation",
                links: [
                  { label: "Marketplace", url: "/" },
                  { label: "Broker Network", url: "/" },
                  { label: "Intelligence", url: "/" },
                  { label: "Recent Listings", url: "/" },
                  { label: "Events", url: "/" }
                ]
              },
              {
                title: "Business Verticals",
                links: [
                  { label: "Commercial Estates", url: "/" },
                  { label: "Luxury Residential", url: "/" },
                  { label: "Industrial Plots", url: "/" },
                  { label: "Retail Spaces", url: "/" },
                  { label: "Investment Portfolios", url: "/" }
                ]
              }
            ],
            copyright: "© 2026 Brokerspost Network Platform."
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update landing page config
// @route   PUT /api/v1/landing-config
// @access  Private/Admin
exports.updateLandingConfig = async (req, res) => {
  try {
    let config = await LandingPageConfig.findOne();

    if (!config) {
      config = await LandingPageConfig.create(req.body);
    } else {
      config = await LandingPageConfig.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
