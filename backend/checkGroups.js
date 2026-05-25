const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@cluster0.b0gtt.mongodb.net/brokerpost?retryWrites=true&w=majority')
  .then(async () => {
    const Group = require('./src/models/Group');
    const Posting = require('./src/models/Posting');
    
    const groups = await Group.find({});
    console.log('Groups:', JSON.stringify(groups, null, 2));
    
    const postings = await Posting.find({ postedBy: '6a11f92533d3613fa7546dde' });
    console.log('Postings by Neeraj:', postings.length);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
