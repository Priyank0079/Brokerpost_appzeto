require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Posting = require('./src/models/Posting');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brokerpost');
    console.log('Connected to DB');
    const postings = await Posting.find({ boostedAt: null });
    for (const p of postings) {
      p.boostedAt = p.createdAt;
      await p.save({ validateBeforeSave: false });
    }
    console.log(`Updated ${postings.length} postings.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
