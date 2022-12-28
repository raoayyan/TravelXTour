const express = require('express')
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const session = require('express-session')
const {isLoggedIn} = require('../middleware');
const users = require('../controllers/user');


router.route('/register')
      .get(users.renderRegisterForm)
      .post(catchAsync(users.registerNewUser));

router.route('/login')
      .get( users.renderLoginForm)
      .post( passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}) , users.LoginRedirrect);

// router.get('/logout',(req,res)=>{
//     req.logout(); // this logout function attached to req obj is due to passport bcz of tthat passport this ftn came with req obj
//     req.flash('success','GoodBye');
//     res.redirect('/campgrounds')
// })

router.get("/logout", users.logout);
module.exports = router;