//================================================
// NPM PACKAGES
var express = require('express'),
    app = express(),
    mongoose = require('mongoose');

//================================================
// ROUTES
  var users = require('./routes/api/users');
  var profiles = require('./routes/api/profiles');
  var posts = require('./routes/api/posts');

//================================================
// DATABASE SETUP
  // DB url
  var dbURL = require('./config/keys').mongoURL;
  // DB connect
  mongoose.connect(dbURL,{useNewUrlParser: true})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

//================================================
app.get('/', (req, res) => {res.send('Boom!')});

// Use routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

//================================================
var PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});