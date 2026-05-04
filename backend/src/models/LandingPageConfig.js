const mongoose = require('mongoose');

const LandingPageConfigSchema = new mongoose.Schema({
  sections: {
    hero: {
      title: { type: String, default: "Inventory Management" },
      subtitle: { type: String, default: "Real-time property network and CRM sync" }
    },
    searchPhilosophy: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Search-Based. No Algorithm. Pure Matching." },
      subtitle: { type: String, default: "Unlike social media where posts get buried, Brokerspost is search-first. Connect directly with high-intent buyers without algorithmic interference." },
      features: [{
        title: { type: String },
        desc: [{ type: String }],
        color: { type: String }
      }],
      matchingTitle: { type: String, default: "How Pure Matching Works" },
      matchingSubtitle: { type: String, default: "Our system operates on high-intent search queries that connect inventory directly to demand without interference." },
      matchingBadge: { type: String, default: "Guaranteed visibility for matching criteria." },
      badgeText: { type: String, default: "The Network Philosophy" },
      liveNetworkQueryLabel: { type: String, default: "Live Network Query" },
      liveNetworkQueryExample: { type: String, default: "\"3 BHK + Sector 45 + Below ₹1.5 Cr\"" },
      instantMatchLabel: { type: String, default: "Instant Match" },
      instantMatchStats: { type: String, default: "Found 12 properties from 8 verified brokers" }
    },
    comparison: {
      visible: { type: Boolean, default: true },
      badge: { type: String, default: "The Ultimate Upgrade" },
      title: { type: String, default: "Why Professionals Choose Brokerspost" },
      subtitle: { type: String, default: "We've redesigned real estate networking from the ground up, moving away from noisy feeds to high-intent matching." },
      benefits: [{
        title: { type: String },
        desc: { type: String },
        color: { type: String }
      }],
      activeBrokers: { type: String, default: "2.5k+" }
    },
    howItWorks: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "How Brokerspost Works" },
      subtitle: { type: String, default: "Streamlined for Professional Success" },
      steps: [{
        title: { type: String },
        description: { type: String },
        color: { type: String }
      }]
    },
    campaignProgress: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Platform Velocity" },
      subtitle: { type: String, default: "Tracking our journey towards the network effect. Be part of the ecosystem that's redefining broker collaboration." },
      brokersCurrent: { type: Number, default: 47 },
      brokersTotal: { type: Number, default: 100 },
      listingsCurrent: { type: Number, default: 705 },
      listingsTotal: { type: Number, default: 1500 },
      badgeText: { type: String, default: "Growth Milestone" },
      footerTitle: { type: String, default: "Join now and secure your status as a Founding Member." },
      footerSubtitle: { type: String, default: "Early access ends once milestones are achieved." }
    },
    theMath: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "The Math: Why 100 Brokers Changes Everything" },
      subtitle: { type: String, default: "Network density = Match probability" },
      cards: [{
        brokers: { type: String },
        listings: { type: String },
        requirements: { type: String },
        badge: { type: String },
        badgeClass: { type: String },
        description: { type: String },
        accent: { type: String },
        iconColor: { type: String },
        featured: { type: Boolean, default: false }
      }]
    },
    brokerBenefits: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "How Different Brokers Benefit" },
      subtitle: { type: String, default: "Tailored advantages for every professional profile." },
      benefits: [{
        title: { type: String },
        description: { type: String },
        color: { type: String }
      }]
    },
    networkEffect: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "The Network Effect: Everyone Wins Together" },
      subtitle: { type: String, default: "As the network grows, the value for every broker increases. Our matching engine thrives on collective intelligence." },
      points: [{
        id: { type: Number },
        text: { type: String },
        result: { type: String }
      }],
      testimonial: {
        quote: { type: String },
        author: { type: String },
        location: { type: String },
        avatar: { type: String },
        successRate: { type: String }
      }
    },
    foundingMember: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Be a Founding Member" },
      subtitle: { type: String, default: "The first 100 brokers get exclusive lifetime benefits." },
      slotsRemaining: { type: Number, default: 53 },
      benefits: [{ type: String }],
      ctaText: { type: String, default: "Join Now — Completely Free" },
      footerNote: { type: String, default: "No credit card required • No commitment • Cancel anytime" }
    },
    faqs: {
      visible: { type: Boolean, default: true },
      title: { type: String, default: "Frequently Asked Questions" },
      subtitle: { type: String, default: "Concerns" },
      items: [{
        question: { type: String },
        answer: { type: String }
      }],
      footerText: { type: String, default: "Still have questions? Connect with us" }
    },
    navbar: {
      links: [{
        label: { type: String },
        url: { type: String }
      }]
    },
    contact: {
      email: { type: String, default: "connect@brokerspost.net" },
      phone: { type: String, default: "+91 800-BROKERS" },
      whatsapp: { type: String, default: "910000000000" },
      address: { type: String, default: "Gurgaon, India" }
    },
    footer: {
      brandingDesc: { type: String, default: "The trusted network for real estate professionals. Connecting verified brokers with premium global inventories." },
      certifications: [{
        label: { type: String },
        icon: { type: String } // e.g., 'ShieldCheck', 'Globe'
      }],
      navigation: [{
        title: { type: String },
        links: [{
          label: { type: String },
          url: { type: String }
        }]
      }],
      copyright: { type: String, default: "© 2026 Brokerspost Network Platform." }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LandingPageConfig', LandingPageConfigSchema);
