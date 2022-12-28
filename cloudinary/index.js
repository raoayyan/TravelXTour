const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,  // here cloud_name is predefined by .env file similary api_key and api secret
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary, // figured name above
    params:{
         folder:'yelpCamp',
         allowedFormats:['jpeg','jfif','png','jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}