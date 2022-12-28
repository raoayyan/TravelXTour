const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { campgroundschema } = require('../schemas.js')
const catchAsync = require('../utilities/catchAsync');
const yelpError = require('../utilities/YelpError');
const Campground = require('../models/campground')
const {isLoggedIn,validatecamp,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const {storage} = require('../cloudinary')
const multer  = require('multer')   //check notepad notes
const upload = multer({ storage }) //destination setting  where the upload file or image will be store 

//MVC is approch to structure application
router.route('/')
    .get( catchAsync(campgrounds.index))
    .post( isLoggedIn ,upload.array('image'),validatecamp , catchAsync(campgrounds.createcampground));
    // .post((req,res)=>{ //instead of single u can use array if u have to upload multiple files or pics and for that in ejs upload form u have set 'multiple' in tag and to show req.files
    //     console.log(req.body,req.files);   
    //     res.send('It worked')  ;     // here image is input name for use of multer u must make sure that it matches hte input name.
    // })


router.get('/new',isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
       .get( catchAsync(campgrounds.showcampground))
       .put(isLoggedIn,isAuthor,upload.array('image'), validatecamp,catchAsync(campgrounds.updatecamp))
       .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCamp));

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.editcampground))



module.exports = router;