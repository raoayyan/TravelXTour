const { string } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const review = require('./reviews');

const ImageSchema = new schema({
        url:String,
        filename:String
});
ImageSchema.virtual('thumbnail').get(function(){      // this is just run and not stored in mongodb
    return this.url.replace('/upload','/upload/w_200');
});
const opts = { toJSON: { virtuals: true } }; // this is because vitual cannot be by default available on doc to JSON thing like properties :{ something } like this will not be available

const campgroundschema = new schema({
    title:String,
    image:[ImageSchema],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    description:String,
    location:String,
    author:{
        type:schema.Types.ObjectId,
        ref:'User'
    },
    review:[{
        type: schema.Types.ObjectId,
        ref:'Review'
    }]
} , opts); // using this opts virtual are avail on this JSON object type 

campgroundschema.virtual('properties.popupMarkUp').get(function(){      // this is just run and not stored in mongodb
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(0,25)}</p>`;
});

campgroundschema.post('findOneAndDelete', async function(doc){ // mongoo delete middleware so that if some campground is deleted then review related to it will also be deleted.
    if(doc){
        await review.remove({
            _id:{
                $in :doc.review
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundschema);