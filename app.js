if(process.env.NODE_ENV !== 'production'){  //bcz of this we are always running .env file bcz we r in dev mode 
    require('dotenv').config();
}                                          //process.env.variable_name here variable _name is variable stored in .env file 
//we are in development mode..............


const express = require('express')
const mongoose = require('mongoose');
const methodOverrride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
// const catchAsync = require('./utilities/catchAsync');
const yelpError = require('./utilities/YelpError');
const Campground = require('./models/campground')
const review = require('./models/reviews');
const {campSchema,reviewSchema} = require('./schemas.js')
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')
const session = require('express-session')
const flash  = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const userRoutes = require('./routes/user')
const MongoDBStore = require('connect-mongo');

// const dbUrl = ;
const dbUrl =process.env.DB_URL|| 'mongodb://localhost:27017/yelp-camp';
// 
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

const app = express();
const path = require('path');
// const YelpError = require('./utilities/YelpError');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrride('_method'));
app.use(express.static((__dirname, 'public'))); // this is use to public any thing inside public name directory


const secret = process.env.SECRET || 'thisistopsecret';

const store = app.use(session({
   
    store: MongoDBStore.create({ mongoUrl: dbUrl }),
    touchAfter:24*60*60,
    secret,
  }));

const sessionConfig = {
    store,
    name:'session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie:{
        httpOnly:true, //this means that our cookies will not be accessible by javascript
        // secure:true,
        expires: Date.now()+ 1000*60*60*24*3,
        maxAge:1000*60*60*24*3
    }
}

app.use(session(sessionConfig))

app.use(flash());


// const scriptSrcUrls = [
//      "https://stackpath.bootstrapcdn.com/",
//      "https://api.tiles.mapbox.com/",
//      "https://api.mapbox.com/",
//      "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.js",
//      "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js",
//     "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js",
//     ];

// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
//     "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css",
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css",
//     "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.js",
//     "https://a.tiles.mapbox.com/", 
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
//     ];
// app.use(helmet());


// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives:{
//             defaultSrc:[],
//             connectSrc:["'self'",...connectSrcUrls],
//             scriptSrc:["'unsafe-inline'","'self'",...scriptSrcUrls],
//             styleSrc:["'self'","'unsafe-inline'",...styleSrcUrls],
//             workSrc:["'self'","blob:"],
//             ObjectSrc:[],
//             imgSrc:[
//                 "'self' data:",
//                 "blob:",
                
//                 "https://res.cloudinary.com/dxarzcxrv/",
//                 "https://images.unsplash.com/",
//                 "https://media.istockphoto.com/id/1305448692/photo/shot-of-a-cute-vintage-teapot-in-a-campsite-near-to-lake.jpg?b=1&s=170667a&w=0&k=20&c=8dCGk9eoRrR1BTP3zzREFlqNwQZd5k0aXbRooRWBuU4="
//             ],
//             fontSrc:["'self'",...fontSrcUrls],
//         },
//     })
// );


app.use(passport.initialize())  // this passport is used to make authencation easy like what a complex we did in Auth_Demo
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())  // this will define that user will beb store in session means in which serial or sequence user will be stored in session 
passport.deserializeUser(User.deserializeUser()) // this will define how user will get out from session 


app.use(mongoSanitize());
app.use((req,res,next)=>{
   if(!['/login','/'].includes(req.originalUrl)){
    req.session.returnTo = req.originalUrl
   }

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success') // this is we are having access to this message under success keyword and this is access to all templates because of app.use paradigm
    res.locals.error = req.flash('error')
    next();
})

// app.get('/fakeUser', async(req,res)=>{
//     const user = new User({
//         email:'khan@gmail.com',
//         username:'mike'
//     })
//    const newUser = await User.register(user,'monkey') // this register method is pre define due to use of passport concept and this will hash password  and add salt to it automatically.
//     res.send(newUser);

// })


app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)


app.get('/', (req, res) => {
    res.render('Home')
})


app.all('*', (req, res, next) => {
    next(new yelpError('Page not Found', 404))  // if noting will be found this will create new error and with the help of next it will call next error haldler which  is at last .use 
})
app.use((err, req, res, next) => {
    const { status = 500, } = err;
    if (!err.message) err.message = "SomeThing went wrong";
    res.status(status)
    res.render('error', { err })
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`working at port ${port}`)
})