const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground');
const { descriptor,places } = require('./seedhelper');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open',()=>{
    console.log('Database connected')
})

const smpl = array => array[Math.floor(Math.random() * array.length)]; // any array passed through it it will give u randon item from that passed array

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0; i<150;i++){
    const rndm = Math.floor(Math.random()*1000);
    const random = Math.floor(Math.random()*500);
   const ncamp =  new Campground ({
          author:'63600170f2f70897b9694b09',
          location: `${cities[rndm].city},${cities[rndm].state}`,
          title: `${smpl(descriptor)}, ${smpl(places)}`,
          geometry: { 
             type: 'Point',
             coordinates: [ 
                  cities[rndm].longitude,
                  cities[rndm].latitude,
              ]
             },
         image: [
            {
                url: 'https://res.cloudinary.com/dxarzcxrv/image/upload/v1671013756/yelpCamp/tf1rgvyrhndnkkznq1n1.jpg',
                filename: 'yelpCamp/tf1rgvyrhndnkkznq1n1',
               
              },
              {
                url: 'https://res.cloudinary.com/dxarzcxrv/image/upload/v1671013770/yelpCamp/kpyfz0qtwwzobxl6vwlc.jpg',
                filename: 'yelpCamp/kpyfz0qtwwzobxl6vwlc',
               
              }
         ],
          description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta iure illo, quae mollitia dolor praesentium molestiae aliquam repellat voluptates fugiat consequatur aliquid doloribus nesciunt. Quis eligendi quas placeat cumque labore?",
          price:random
        })
    ncamp.save();
}
}
seedDB();