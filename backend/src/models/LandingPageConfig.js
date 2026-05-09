const mongoose = require('mongoose');

const LandingPageConfigSchema = new mongoose.Schema({
  sections: {
    hero: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: "Live Inventory Search" },
      title: { type: String, default: "India's Most Trusted Broker-to-Broker Inventory Platform" },
      titlePart1: { type: String, default: "India's Most Trusted" },
      titleHighlight: { type: String, default: "Broker-to-Broker" },
      titlePart2: { type: String, default: "Inventory Platform" },
      subtitle: { type: String, default: "A private, verified community where professional real estate brokers share live inventory and requirements." },
      stats: [{
        label: { type: String },
        value: { type: String }
      }]
    },
    search: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: "Live Network Query" },
      title: { type: String, default: "Search the Network" },
      placeholder: { type: String, default: "Location, Project or Type..." }
    },
    inventory: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: "Live Inventory" },
      title: { type: String, default: "Explore Verified Listings" }
    },
    features: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: "Platform Features" },
      title: { type: String, default: "Everything a Broker Needs" },
      subtitle: { type: String, default: "Built exclusively for verified real estate professionals." },
      items: [{
        title: { type: String },
        description: { type: String },
        icon: { type: String }, // Icon name from lucide-react
        color: { type: String }
      }]
    },
    process: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: "Process" },
      title: { type: String, default: "How BrokersPost Works" },
      subtitle: { type: String, default: "Four simple steps to start sharing and closing deals." },
      steps: [{
        number: { type: String },
        title: { type: String },
        description: { type: String }
      }]
    },
    cta: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Join the Verified Broker Network" },
      subtitle: { type: String, default: "Only serious, professional brokers. A community built on trust." },
      buttonText: { type: String, default: "Register as a Verified Broker" }
    },
    footer: {
      brandingDesc: { type: String, default: "The trusted network for real estate professionals." },
      navigation: [{
        title: { type: String },
        links: [{
          label: { type: String },
          url: { type: String }
        }]
      }],
      copyright: { type: String, default: "© 2026 Brokerspost Network Platform." }
    },
    registrationTerms: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Important Disclaimer & Terms of Use" },
      items: [{
        title: { type: String },
        content: { type: String }
      }],
      agreementText: { type: String, default: "I have read and understood all the above terms." }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LandingPageConfig', LandingPageConfigSchema);

