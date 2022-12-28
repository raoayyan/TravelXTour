const { campgroundschema,reviewSchema } = require('./schemas.js')
const yelpError = require('./utilities/YelpError');
const Campground = require('./models/campground');
const Review = require('./models/reviews');


module.exports.isLoggedIn = (req,res,next) =>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be sign in')
        return res.redirect('/login')
    }
    next();
}

module.exports.validatecamp = (req, res, next) => {
   
    const { error } = campgroundschema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new yelpError(msg, 400);
    }else{
        next(); //if you want to go to you actual route where you have use this ftn as middleware ftn
    }
} 

module.exports.isAuthor = async (req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission')
       return res.redirect(`/campgrounds/${id}`)
    }
   
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission')
       return res.redirect(`/campgrounds/${id}`)
    }
   
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new yelpError(msg, 400);
    }else{
        next(); //if you want to go to you actual route where you have use this ftn as middleware ftn
    }
}
