const campground = require('../models/campground');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxtoken})
module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })
}

module.exports.renderNewForm = (req, res) => {
   
    res.render('campgrounds/new')
}

module.exports.createcampground = async (req, res, next) => {
   const geodata = await geocoder.forwardGeocode({   // indicates geocoding APi
        query:req.body.campground.location,
        limit: 1
    }).send();
    
    const campu = new Campground(req.body.campground);
    campu.image = req.files.map(f =>({url: f.path, filename:f.filename}))
    campu.geometry = geodata.body.features[0].geometry;
    campu.author = req.user._id;
    await campu.save();
    console.log(campu);
    req.flash('success','successfully created new campground');
    res.redirect(`/campgrounds/${campu._id}`)

}
module.exports.showcampground = async (req, res) => {
    const { id } = req.params;
    const campi = await Campground.findById(id).populate({ // populating review of campground we found with name campi
        path: 'review', //populating review
        populate:{   //then for each review we are populating author of it.
            path : 'author'
        }
    
    }).populate('author');
    
    if(!campi){
        req.flash('error', 'Not found that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campi })
}

module.exports.editcampground = async (req, res) => {
    const { id } = req.params;
    const campi = await Campground.findById(id);
    if(!campi){
        req.flash('error','cannot find that campground')
       return res.redirect('/campgrounds')
    }
   
    res.render('campgrounds/edit', { campi })
}

module.exports.updatecamp = async (req, res, next) => {

    const { id } = req.params;
    
    // const updatecamp = await Campground.findById(id)
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground })
  const imgs = req.files.map(f =>({url: f.path, filename: f.filename})); 
   camp.image.push(...imgs); 
                                                                 // basically this req.files.map  create an array and pushing an array to an existing array will be difficult so we store this array in a variable and then with the help of spread we got each item of  separately and then it is easy to push it in existing array
   await camp.save();
   if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename); //for deleteing images from cloudinary database
    }
    // await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages }}}});
    await camp.updateOne({$pull: {image:{filename:{$in :req.body.deleteImages}}}})
   
}   
    req.flash('success','successfully updated campground');
    res.redirect(`/campgrounds/${camp.id}`);
    
} 
module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const updatecamp = await Campground.findById(id)
    if(!updatecamp.author.equals(req.user._id)){
        req.flash('error','You do not have permission')
       return res.redirect(`/campgrounds/${id}`)
    }
    const delcamp = await Campground.findByIdAndDelete(id);
    req.flash('success',"successfully deleted campground")
    res.redirect('/campgrounds');
}   