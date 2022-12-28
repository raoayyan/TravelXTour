const Campground = require('../models/campground');
const review = require('../models/reviews');


module.exports.createReview = async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const Review = new review(req.body.review);
    Review.author = req.user._id;
    campground.review.push(Review)
    await Review.save(); 
    await campground.save();
    req.flash('success','successfully created new review');
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteReview = async(req,res,)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}}) // basically we are using $pull that remove all instance of that matched object or value passed
    await review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}
