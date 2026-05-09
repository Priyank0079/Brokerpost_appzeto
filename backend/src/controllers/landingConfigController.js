const LandingPageConfig = require('../models/LandingPageConfig');

// Get current landing page configuration
exports.getLandingConfig = async (req, res) => {
  try {
    let config = await LandingPageConfig.findOne().sort({ updatedAt: -1 });
    
    if (!config) {
      // Return default configuration if none exists
      config = new LandingPageConfig({
        sections: {
          hero: {
            visible: true,
            badge: "Live Inventory Search",
            title: "India's Most Trusted Broker-to-Broker Inventory Platform",
            titlePart1: "India's Most Trusted",
            titleHighlight: "Broker-to-Broker",
            titlePart2: "Inventory Platform",
            subtitle: "A private, verified community where professional real estate brokers share live inventory and requirements — deal directly with each other.",
            stats: [
              { label: "Live Listings", value: "42" },
              { label: "Verified Brokers", value: "15" },
              { label: "Brokerage Charged", value: "₹0" },
              { label: "Direct Deals", value: "100%" }
            ]
          },
          search: {
            visible: true,
            badge: "Live Network Query",
            title: "Search the Network",
            placeholder: "Location, Project or Type..."
          },
          inventory: {
            visible: true,
            badge: "Live Inventory",
            title: "Explore Verified Listings"
          },
          features: {
            visible: true,
            badge: "Platform Features",
            title: "Everything a Broker Needs",
            subtitle: "Built exclusively for verified real estate professionals who believe in transparent, direct dealings.",
            items: [
              {
                title: 'Verified Broker Community',
                description: 'Every member is a verified professional broker. No public users, no fake listings.',
                icon: 'ShieldCheck',
                color: 'bg-primary-50 text-primary-500'
              },
              {
                title: 'Zero Brokerage Platform',
                description: 'This platform does not charge any brokerage or commission. Connect directly.',
                icon: 'Handshake',
                color: 'bg-blue-50 text-blue-500'
              }
            ]
          },
          process: {
            visible: true,
            badge: "Process",
            title: "How BrokersPost Works",
            subtitle: "Four simple steps to start sharing and closing deals with verified brokers.",
            steps: [
              { number: '01', title: 'Register & Get Verified', description: 'Submit your broker details and get instant access.' },
              { number: '02', title: 'Post Your Inventory', description: 'Add available properties or client requirements.' }
            ]
          },
          cta: {
            visible: true,
            title: "Join the Verified Broker Network",
            subtitle: "Only serious, professional brokers. A community built on trust, transparency and real inventory.",
            buttonText: "Register as a Verified Broker"
          },
          footer: {
            brandingDesc: "The trusted network for real estate professionals. Connecting verified brokers with premium global inventories.",
            navigation: [
              {
                title: "Platform",
                links: [
                  { label: "Browse Inventory", url: "#inventory" },
                  { label: "Features", url: "#features" }
                ]
              }
            ],
            copyright: "© 2026 Brokerspost Network Platform."
          },
          registrationTerms: {
            visible: true,
            title: "Important Disclaimer & Terms of Use",
            items: [
              { title: "Verification", content: "All users must be verified brokers." }
            ],
            agreementText: "I have read and understood all the above terms."
          }
        }
      });
      await config.save();
    }
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching landing config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch landing configuration',
      error: error.message
    });
  }
};

// Update landing page configuration
exports.updateLandingConfig = async (req, res) => {
  try {
    const configData = req.body;
    
    let config = await LandingPageConfig.findOne().sort({ updatedAt: -1 });
    
    if (config) {
      config.sections = configData.sections;
      config.updatedAt = Date.now();
      await config.save();
    } else {
      config = new LandingPageConfig(configData);
      await config.save();
    }
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error updating landing config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update landing configuration',
      error: error.message
    });
  }
};
