const User = require('../models/user');

module.exports.renderRegisterForm =  (req,res)=>{
    res.render('users/register');
}
module.exports.registerNewUser = async (req,res)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registereduser = await User.register(user,password);
        req.login(registereduser, err =>{
           if(err) return next(err);
        req.flash('success','Welcome to Yelp-Camp')
        res.redirect('/campgrounds');
        })
        
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}
module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.LoginRedirrect = (req,res)=>{
    req.flash('success', 'Welcome Back ');
    const registerURL =  req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(registerURL); 
}
module.exports.logout = (req, res) => {
    req.logout(function(err)  {
      if(err) return next(err);
      req.flash('success','GoodBye');
      res.redirect("/campgrounds");
    });
    

  }