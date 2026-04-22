import glassVilla from '../assets/listings/glass_villa.png';
import penthouse from '../assets/listings/penthouse.png';
import officeSpace from '../assets/listings/office_space.png';
import skyVilla from '../assets/listings/sky_villa.png';
import corporateFloor from '../assets/listings/corporate_floor.png';
import familyHome from '../assets/listings/family_home.png';
import plot from '../assets/listings/plot.png';
import retailShop from '../assets/listings/retail_shop.png';

export const listings = [
  { id: 1, title: 'Modern Glass Villa', location: 'Beverly Hills, CA', beds: 5, sqft: 8500, price: 12500000, broker: 'John Doe', status: 'Active', vertical: 'Residential', type: 'Apartment', transaction: 'Sale', flow: 'Availability', image: glassVilla },
  { id: 2, title: 'Skyline Penthouse', location: 'Manhattan, NY', beds: 3, sqft: 4200, price: 8900000, broker: 'Jane Smith', status: 'Pending', vertical: 'Residential', type: 'Penthouse', transaction: 'Sale', flow: 'Availability', image: penthouse },
  { id: 3, title: 'Tech Hub Office Space', location: 'Palo Alto, CA', beds: 0, sqft: 15000, price: 0, broker: 'Mike Wilson', status: 'Active', vertical: 'Commercial', type: 'Office', transaction: 'Rent', flow: 'Requirement', image: officeSpace },
  { id: 4, title: 'Luxury Sky Villa', location: 'Worli, Mumbai', beds: 4, sqft: 3500, price: 150000000, broker: 'Amit Sharma', status: 'Active', vertical: 'Residential', type: 'Apartment', transaction: 'Sale', flow: 'Availability', image: skyVilla },
  { id: 5, title: 'Corporate Floor', location: 'BKC, Mumbai', beds: 0, sqft: 25000, price: 450000, broker: 'Rajesh Malhotra', status: 'Pending', vertical: 'Commercial', type: 'Office', transaction: 'Rent', flow: 'Availability', image: corporateFloor },
  { id: 6, title: 'Suburban Family Home', location: 'Powai, Mumbai', beds: 3, sqft: 1800, price: 35000000, broker: 'Priya Verma', status: 'Active', vertical: 'Residential', type: 'Villa', transaction: 'Sale', flow: 'Availability', image: familyHome },
  { id: 7, title: 'Plot for Development', location: 'Panvel, Navi Mumbai', beds: 0, sqft: 10000, price: 50000000, broker: 'Suresh Raina', status: 'Active', vertical: 'Residential', type: 'Plot', transaction: 'Sale', flow: 'Availability', image: plot },
  { id: 8, title: 'Retail High Street Shop', location: 'Colaba, Mumbai', beds: 0, sqft: 800, price: 150000, broker: 'Neha Gupta', status: 'Pending', vertical: 'Commercial', type: 'Shop', transaction: 'Rent', flow: 'Requirement', image: retailShop },
];

for (let i = 0; i < listings.length; i++) {
  // Add mock video for even IDs
  if (listings[i].id % 2 === 0) {
    listings[i].video = 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-balcony-view-at-night-42261-large.mp4';
  }
}
