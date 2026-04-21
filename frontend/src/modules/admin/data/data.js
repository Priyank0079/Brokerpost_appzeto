export const brokers = [
  { id: 1, name: 'Amit Sharma', mobile: '9876543210', email: 'amit@example.com', location: 'Mumbai', status: 'Approved', plan: 'Gold', joined: '2026-01-15' },
  { id: 2, name: 'Rajesh Malhotra', mobile: '9876543211', email: 'rajesh@example.com', location: 'Delhi', status: 'Pending', plan: 'Silver', joined: '2026-03-20' },
  { id: 3, name: 'Priya Verma', mobile: '9876543212', email: 'priya@example.com', location: 'Bangalore', status: 'Approved', plan: 'Free', joined: '2026-02-10' },
  { id: 4, name: 'Suresh Raina', mobile: '9876543213', email: 'suresh@example.com', location: 'Chennai', status: 'Blocked', plan: 'Gold', joined: '2025-11-05' },
  { id: 5, name: 'Neha Gupta', mobile: '9876543214', email: 'neha@example.com', location: 'Pune', status: 'Approved', plan: 'Silver', joined: '2026-04-01' },
];

export const listings = [
  { id: 1, title: 'Luxury Villa in Hiranandani', location: 'Powai, Mumbai', type: 'Residential', category: 'Sale', price: 85000000, broker: 'Amit Sharma', status: 'Active' },
  { id: 2, title: 'Commercial Office Space', location: 'Connaught Place, Delhi', type: 'Commercial', category: 'Rent', price: 250000, broker: 'Rajesh Malhotra', status: 'Pending' },
  { id: 3, title: 'Modern 3BHK Apartment', location: 'Koramangala, Bangalore', type: 'Residential', category: 'Sale', price: 18000000, broker: 'Priya Verma', status: 'Active' },
  { id: 4, title: 'Retail Shop in DLF Mall', location: 'Gurugram', type: 'Commercial', category: 'Rent', price: 150000, broker: 'Amit Sharma', status: 'Spam' },
];

export const groups = [
  { id: 1, name: 'Mumbai Luxury Brokers', members: 124, createdBy: 'Amit Sharma', region: 'Mumbai' },
  { id: 2, name: 'South Delhi Top Agents', members: 85, createdBy: 'Rajesh Malhotra', region: 'Delhi' },
  { id: 3, name: 'Bangalore Tech Park Deals', members: 210, createdBy: 'Priya Verma', region: 'Bangalore' },
];

export const subscriptions = [
  { id: 1, brokerName: 'Amit Sharma', plan: 'Gold', start: '2026-01-15', expiry: '2027-01-15', status: 'Active' },
  { id: 2, brokerName: 'Rajesh Malhotra', plan: 'Silver', start: '2026-03-20', expiry: '2027-03-20', status: 'Active' },
  { id: 3, brokerName: 'Suresh Raina', plan: 'Gold', start: '2025-11-05', expiry: '2026-11-05', status: 'Active' },
  { id: 4, brokerName: 'Old User', plan: 'Free', start: '2025-01-01', expiry: '2026-01-01', status: 'Expired' },
];

export const payments = [
  { id: 1, brokerName: 'Amit Sharma', amount: 15000, plan: 'Gold', date: '2026-01-15', status: 'Success' },
  { id: 2, brokerName: 'Rajesh Malhotra', amount: 8000, plan: 'Silver', date: '2026-03-20', status: 'Success' },
  { id: 3, brokerName: 'Priya Verma', amount: 0, plan: 'Free', date: '2026-02-10', status: 'Success' },
  { id: 4, brokerName: 'Failed Transaction', amount: 15000, plan: 'Gold', date: '2026-04-10', status: 'Failed' },
];
