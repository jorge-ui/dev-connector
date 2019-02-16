// Dev packages
  var colors = require('colors');
//================================================
// NPM PACKAGES
var seedDB = require('./seedDB');
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport');

//================================================
// APP CONFIG
  // Use body parser
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  // Require routes
  var users = require('./routes/api/users');
  var profiles = require('./routes/api/profiles');
  var posts = require('./routes/api/posts');

//================================================
// DATABASE SETUP
  // DB url
  if (process.env.DATABASEURL === undefined || process.env.DATABASEURL === null) {
    process.env.DATABASEURL = require('./config/keys').mongoURL;
  }
  // DB connect
  mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true})
    .then(() => {
      console.log('MongoDB connected!'.green)
      seedDB();
    })
    .catch(err => console.log(err));

//================================================
// Passport middleware
  app.use(passport.initialize());
// Passport config strategy
  require('./config/passport')(passport);

// Use routes
  app.get('/', (req, res) => res.json({msg: "Landing page"}));
  app.use('/api/users', users);
  app.use('/api/profiles', profiles);
  app.use('/api/posts', posts);

//================================================
var PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});