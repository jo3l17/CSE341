/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling. 
 * They're for information purposes only.
 * 
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course. 
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const routes = require('./routes/index');
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const MONGODB_URI = "mongodb+srv://jo3l17:953945798Yo@@cse341cluster.jfrzp.mongodb.net/shop?retryWrites=true&w=majority";
0
const app = express();

const store = new MongoDBStore({
   uri: MONGODB_URI,
   collection: 'sessions'
})
const csrfProtection = csrf();

const corsOptions = {
   origin: "https://cse341-prove.herokuapp.com/",
   optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://jo3l17:953945798Yo@@cse341cluster.jfrzp.mongodb.net/shop?retryWrites=true&w=majority";


app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(bodyParser({ extended: false })) // For parsing the body of a POST
   .use(session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store
   }));
app.use(csrfProtection);
app.use((req, res, next) => {
      if (!req.session.user) {
         return next();
      }
      User.findById(req.session.user._id)
         .then(user => {
            req.user = user;
            next();
         }).catch(err => console.log(err));
   })
   .use((req, res, next) => {
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      next();
   })
   // For view engine as Pug
   //.set('view engine', 'pug') // For view engine as PUG. 
   // For view engine as hbs (Handlebars)
   //.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'})) // For handlebars
   //.set('view engine', 'hbs')
   .use('/', routes)
// .listen(PORT, () => console.log(`Listening on ${ PORT }`));



mongoose
   .connect(
      MONGODB_URL, options
   )
   .then(result => {
      // User.findOne().then(user => {
      //    if (!user) {
      //       const user = new User({
      //          name: 'Joel',
      //          email: 'johan_17@byui.edu',
      //          cart: {
      //             items: []
      //          }
      //       });
      //       user.save();
      //    }
      // })
      console.log('Mongoose Connected!!');
      app.listen(PORT);
   })
   .catch(err => {
      console.log(err);
   });