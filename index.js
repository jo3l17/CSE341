
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000
const routes = require('./routes/index');
const mongoose = require('mongoose');
const User = require('./project/models/user');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

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

const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;

app.use(cors(corsOptions))
   .use(express.static(path.join(__dirname, 'public')))
   .set('views', [path.join(__dirname, 'views'),path.join(__dirname, 'project/views')])
   .set('view engine', 'ejs')
   .use(bodyParser({ extended: false })) // For parsing the body of a POST deprecated
   .use(session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store
   }))
   .use(csrfProtection)
   .use(flash())
   .use((req, res, next) => {
      if (!req.session.user) {
         return next();
      }
      User.findById(req.session.user._id)
         .then(user => {
            if(!user){
               return next();
            }
            req.user = user;
            next();
         }).catch(err => {
            throw new Error(err);
            // console.log(err);
         });
   })
   .use((req, res, next) => {
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      res.locals.errorMessage = req.flash('error');
      next();
   })
   .use('/', routes)



mongoose
   .connect(
      MONGODB_URL, options
   )
   .then(result => {
      console.log('Mongoose Connected!!');
      app.listen(PORT);
   })
   .catch(err => {
      console.log(err);
   });