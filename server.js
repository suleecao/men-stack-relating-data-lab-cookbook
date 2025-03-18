const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const authController = require('./controllers/auth.js');

// mounted middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-to-user-view.js');
const foodsController = require('./controllers/foods.js');

const port = process.env.PORT ? process.env.PORT : '3001';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

//css stuff
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

//route to landing page
app.get('/', (req, res) => {
  if (req.session.user) {
   res.redirect(`/users/${req.session.user._id}/foods`);
  } else {
   res.render('index.ejs')
  }
 });


app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
