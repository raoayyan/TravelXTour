const express = require('express');
const router = express.Router({mergeParams:true}); // without this mergeparams you would not be able to access any id that was used in app js in route if you added that id contaned routes in app.js 

const catchAsync = require('../utilities/catchAsync');
const yelpError = require('../utilities/YelpError');
const {campSchema,reviewSchema} = require('../schemas.js')
const Campground = require('../models/campground')
const review = require('../models/reviews');
const {isLoggedIn,validateReview, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews')


router.post('',isLoggedIn, validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;