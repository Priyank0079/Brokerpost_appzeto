export const listings = [
  { id: 1, title: 'Modern Glass Villa', location: 'Beverly Hills, CA', beds: 5, sqft: 8500, price: 12500000, broker: 'John Doe', status: 'Active', vertical: 'Residential', type: 'Apartment', transaction: 'Sale', flow: 'Availability' },
  { id: 2, title: 'Skyline Penthouse', location: 'Manhattan, NY', beds: 3, sqft: 4200, price: 8900000, broker: 'Jane Smith', status: 'Pending', vertical: 'Residential', type: 'Penthouse', transaction: 'Sale', flow: 'Availability' },
  { id: 3, title: 'Tech Hub Office Space', location: 'Palo Alto, CA', beds: 0, sqft: 15000, price: 0, broker: 'Mike Wilson', status: 'Active', vertical: 'Commercial', type: 'Office', transaction: 'Rent', flow: 'Requirement' },
  { id: 4, title: 'Luxury Sky Villa', location: 'Worli, Mumbai', beds: 4, sqft: 3500, price: 150000000, broker: 'Amit Sharma', status: 'Active', vertical: 'Residential', type: 'Apartment', transaction: 'Sale', flow: 'Availability' },
  { id: 5, title: 'Corporate Floor', location: 'BKC, Mumbai', beds: 0, sqft: 25000, price: 450000, broker: 'Rajesh Malhotra', status: 'Pending', vertical: 'Commercial', type: 'Office', transaction: 'Rent', flow: 'Availability' },
  { id: 6, title: 'Suburban Family Home', location: 'Powai, Mumbai', beds: 3, sqft: 1800, price: 35000000, broker: 'Priya Verma', status: 'Active', vertical: 'Residential', type: 'Villa', transaction: 'Sale', flow: 'Availability' },
  { id: 7, title: 'Plot for Development', location: 'Panvel, Navi Mumbai', beds: 0, sqft: 10000, price: 50000000, broker: 'Suresh Raina', status: 'Active', vertical: 'Residential', type: 'Plot', transaction: 'Sale', flow: 'Availability' },
  { id: 8, title: 'Retail High Street Shop', location: 'Colaba, Mumbai', beds: 0, sqft: 800, price: 150000, broker: 'Neha Gupta', status: 'Pending', vertical: 'Commercial', type: 'Shop', transaction: 'Rent', flow: 'Requirement' },
];

for (let i = 0; i < listings.length; i++) {
  listings[i].image = `https://images.unsplash.com/photo-${1560518883 - i * 1000}-ce09059eeffa?auto=format&fit=crop&q=80&w=400&h=300`;
}
