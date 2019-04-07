var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keys = require('../../config/keys');
var passport = require('passport');
//models
var User = require('../../models/User');
var colors = require('colors');
var Profile = require('../../models/Profile')
var multer = require('multer')
var upload = multer({'dest': 'uploads/'})
var cloudinary = require('cloudinary').v2
var {OAuth2Client} = require('google-auth-library')
var fs = require('fs')
cloudinary.config({ 
   cloud_name: 'jrdeveloper71', 
   api_key: '868159148225767', 
   api_secret: process.env.CLOUDINARY_API_SECRET, 
});

// Load input validation
var validateRegisterInput = require('../../validation/register');
var validateLoginInput = require('../../validation/login');


// @route   CREATE api/users/register
// @info    Register a user
// @access  Public
router.post('/register', (req, res) => {
   // Validate register input
   var validation = validateRegisterInput(req.body);
   if (!validation.isValid) {
      return res.status(400).json(validation.errors); // validation error
   }
   // Find by email
   User.findOne({
         email: req.body.email
      })
      .then((foundUser) => {
         // Check if email exist
         if (foundUser) {
            return res.status(400).json({
               email: 'Email already exist'
            }) // email already exist
         } else {
            // Create newUser object
            var newUser = new User({
               name: req.body.name,
               email: req.body.email,
               password: req.body.password
            });
            // hash password
            bcrypt.genSalt(10, (err, salt) => {
               if (err) throw err;
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                  newUser.password = hash;
                  // save newUser to DB
                  newUser.save()
                     .then((createdUser) => res.status(201).json(createdUser))
                     .catch(err => console.log(err));
               });
            });
         }
      });
});


// @route   LOGIN api/users/login
// @info    Login User/ Return JWT Token
// @access  Public
router.post('/login', async (req, res) => {
   // Google sign in
   if(req.body.idtoken) {
      // Verify idtoken
      var client = new OAuth2Client('48398124661-gd6p9j8ad7sbrl5uvls2tbrsfi5pmidc.apps.googleusercontent.com')
      const ticket = await client.verifyIdToken({
         idToken: req.body.idtoken,
         audience: '48398124661-gd6p9j8ad7sbrl5uvls2tbrsfi5pmidc.apps.googleusercontent.com',
     });
     // Get decoded verified token
     const googlePayload = ticket.getPayload();
     let user = await User.findOne({googleId: googlePayload.sub})
     // If no user for that token, create new
     if(!user) {
        user = await User.create({
            googleId: googlePayload.sub,
            name: googlePayload.name,
            email: googlePayload.email,
            password: googlePayload.sub,
            picture: {
               url: googlePayload.picture,
            }
        })
     }
     // Prepare jwt token
     var payload = {
         googleId: user.googleId,
         id: user.id,
         name: user.name,
         handle: user.handle,
         picture: user.picture,
      }
     // Sign jwt token
     jwt.sign(payload, keys.jwtSecret, {expiresIn: "1h"}, (err, token) => {
         if (err) throw err;
         // send token
         return res.status(202).json({
            success: true,
            token: "Bearer " + token
         })
      });
   // Regular sign in
   } else {
      // Validate register input
      var validation = validateLoginInput(req.body);
      if (validation.isValid === false) {
         return res.status(400).json(validation.errors); // validation error
      }
      // Find by email
      User.findOne({
            email: req.body.email
         })
         .then(async(foundUser) => {
            const userProfile = await Profile.findOne({user: foundUser._id})
            if (!foundUser) {
               return res.status(404).json({
                  email: "User not found"
               }); // user not found
            } else {
               // compare password
               bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
                  if (isMatch) {
                     // password correct, prepare jwt token
                     var payload = {
                        id: foundUser.id,
                        name: foundUser.name,
                        handle: userProfile && userProfile.handle,
                        picture: foundUser && foundUser.picture
                     };
                     // sign jwt token
                     jwt.sign(payload, keys.jwtSecret, {expiresIn: "1h"}, (err, token) => {
                        if (err) throw err;
                        // send token
                        return res.status(202).json({
                           success: true,
                           token: "Bearer " + token
                        })
                     });
                  } else {
                     // password incorrect
                     console.log("Password is incorrect".red)
                     return res.status(400).json({
                        password: "Password incorrect"
                     }); // password incorrect
                  }
               });
            }
         });
   }
});


// @route   POST api/user/picture
// @info    Upload a user picture
// @access  Private
// multer middleware to handle incoming files
router.use('/picture', upload.array('picture', 1))
router.post('/picture', passport.authenticate('jwt', {session: false}), async (req, res) => {
   // Send error if there is no file
   if(req.files.length === 0) return res.status(400).json({nofile: "*Include file before upload"})

   // Upload to cloudinary api
   const file = req.files[0]   
   let uploadedPicture =  await cloudinary.uploader.upload( file.path, {
      public_id: `MERNapp/users_pictures/user_${req.user.id}`,
      aspect_ratio: "1:1", gravity: "face:center", crop: "thumb"
   })
   
   // Delete temp sotored files
   fs.unlink(file.path, ((err) => {
      if(!err) console.log(`${file.originalname} was deleted`)
      else console.log('fs error:', err)
   }))

   // Save uploaded picture url to User
   User.findById(req.user.id)
      .then((user) => {
         user.picture = {
            url: uploadedPicture.secure_url,
            public_id: uploadedPicture.public_id,
         }
         user.save().then((saved) => res.status(201).json(saved.picture))
      })
})

// @route   DELETE api/user/picture
// @info    Dlete current picture
// @access  Private
router.delete('/picture', passport.authenticate('jwt', {session: false}), async (req, res) => {

   let uploadedPicture =  await cloudinary.uploader.destroy(req.user.picture.public_id)

   User.findById(req.user.id)
      .then((user) => {
         user.picture = {
            url: null,
            public_id: null
         }
         user.save().then((saved) => res.status(204).json(saved.picture))
      })
})


// @route   CURRENT api/users/current
// @info    Return crrent user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
   let user = await User.findById(req.user.id)
   res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      handle: user.handle,
      picture: user.picture
   });
});


module.exports = router;