//================================================
// NPM PACKAGES
var
   express    = require('express'),
   app        = express(),
   mongoose   = require('mongoose'),
   bodyParser = require('body-parser'),
   passport   = require('passport'),
   path       = require('path'),
   compression = require('compression');

//================================================
// APP CONFIG
// Use body parser
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());
// Require routes
var usersRoutes = require('./routes/api/users');
var profilesRoutes = require('./routes/api/profiles');
var postsRoutes = require('./routes/api/posts');
var commentsRoutes = require('./routes/api/comments');

//================================================
// DATABASE SETUP
// DB url
if (!process.env.DATABASEURL) {
   process.env.DATABASEURL = require('./config/keys').mongoURL;
}
// DB connect
mongoose.connect(process.env.DATABASEURL, {
      useNewUrlParser: true
   })
   .then(() => {
      console.log('MongoDB connected!')
      //seedDB();
   })
   .catch(err => console.log(err));

//================================================

// Passport middleware
app.use(passport.initialize());
app.use(compression({ filter: shouldCompress }))
// Passport config strategy
require('./config/passport')(passport);

app.use('/api/users', usersRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts/:id/comments', commentsRoutes);


app.use(express.static('client/build'))
app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

//================================================
var PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
   console.log('App listening on port ' + PORT);
});

// Funtions definitions
function shouldCompress (req, res) {
   if (req.headers['x-no-compression']) {
     // don't compress responses with this request header
     return false
   }
  
   // fallback to standard filter function
   return compression.filter(req, res)
 }
 