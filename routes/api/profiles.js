var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var validateFields = require('../../validation/validateFields');


// Models
var Profile = require('../../models/Profile');
var User = require('../../models/User');

//================================================
// RESTful routes

// @route   CURRENT
// @info    Get current user profile
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
   var errors = {};
   // Find by user id
   Profile.findOne({
         user: req.user.id
      })
      .then(foundProfile => {
         if (!foundProfile) {
            // profile not found
            errors.noProfile = "There is no profile for this user";
            return res.status(404).json(errors); // not found
         } else {
            // profile found
            res.status(200).json(foundProfile); // return profile
         }
      })
      .catch(err => res.status(404).json(err)); // error finding profile
})

// @route   INDEX
// @info    Get all user profiles
// @access  Public
router.get('/', (req, res) => {
   var errors = {};
   // Find by user id
   Profile.find({}).populate("user")
      .then(foundProfile => {
         if (!foundProfile) {
            // profile not found
            errors.noProfile = "No profiles found";
            return res.status(404).json(errors); // not found
         } else {
            // profile found
            res.json(foundProfile); // return profile
         }
      })
      .catch(err => res.status(404).json(err)); // error finding profile
})

// @route   CREATE
// @info    Crate new user profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   var errors = {};
   // Empty profile fields obj
   var newProfile = {};
   // Associate user with profile
   newProfile.user = req.user.id;
   // Validate input
   var validation = validateFields(req.body, require('../../validation/profileList'));
   // If not valid, return errors
   if(!validation.isValid) return res.status(400).json(validation.errors);

   // Check if handle exist
   Profile.findOne({handle: newProfile.handle})
   .then((profile) => {

      if(profile) { // Handle already exist
         errors.handle = 'That handle alredy exist';
         return res.status(400).json(errors)
      } 

      // Fill profileFields object
      for (let key in Profile.schema.obj) {
         switch (key) {
            case 'skills': // Make array and trim
               newProfile.skills = req.body.skills.split(',').map((skill) => skill.trim())
               break;
            case 'social': // Make empty object and fill it
               newProfile.social = {};
               for (let social in Profile.schema.obj.social) {
                  if (req.body[social]) newProfile.social[social] = req.body[social];
               }
               break;
            default: // Defult check field in body and add to profileFields
               if (req.body[key]) newProfile[key] = req.body[key];
         }
      }

      // Save handle to user model and create profile
      User.findById(req.user.id)
      .then((user) => {
         user.handle = newProfile.handle
         user.save().then(() =>{
            Profile.create(newProfile)
            .then((profile) => res.status(201).json(profile))// Success creating profile
            .catch(err => console.log(err));
         })
      })
   }).catch((err) => console.log(err))
})


// @route   SHOW
// @info    Get current profile by handle
// @access  Public
router.get('/:handle', (req, res) => {
   const errors = {};
   
   Profile.findOne({handle: req.params.handle}).populate("user").exec()
      .then((foundProfile) => {
         if(!foundProfile) {
            errors.noProfile = 'There is no profile for this user';
            return res.status(404).json(errors);
         } else {
         	foundProfile.user.password = null
            res.status(200).json(foundProfile); // Success
         }
      })
      .catch((err) => res.status(404).json(err))
})


// @route   UPDATE
// @info    Update a user profile
// @access  Private
router.put('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   var errors = {};
   // Validate input
      var validation = validateFields(req.body, require('../../validation/profileList'));
      // If not valid, return errors
      if(!validation.isValid) return res.status(400).json(validation.errors);

   // Fill profileFields object
   var profileFields = {};
   Object.keys(Profile.schema.obj).forEach((key) => {
      switch (key) {
         case 'skills': // Make array and trim
            profileFields.skills = req.body.skills.split(',');
            // Trim skills array
            profileFields.skills = profileFields.skills.map((skill) => skill.trim())
            break;
         case 'social': // Make empty object and fill it
            profileFields.social = {};
            // Iterate through schema social object
            Object.keys(Profile.schema.obj.social).forEach((socialField) => {
               // Fill the social obejct for each social link found in body field
               if (req.body[socialField]) profileFields.social[socialField] = req.body[socialField];
            })
            break;
         default: // Defult check field in body and add to profileFields
            if (req.body[key]) profileFields[key] = req.body[key];
      }
      if (req.body.handle) profileFields.handle
   })
   // Leave handle out of update
   delete profileFields.handle
   // Now, find user and update
   Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields})
      .then((updatedProfile) =>  res.json(updatedProfile))
})


// @route   CREATE EXPERIENCE
// @info    Add experience to user profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
   var errors = {};
   // Validate input
      var validation = validateFields(req.body, require('../../validation/experienceList'));
      // If not valid, return errors
      if(!validation.isValid) return res.status(400).json(validation.errors);

   // Fill object to update
   let experienceFields = {};
   Object.keys(Profile.schema.obj.experience[0]).forEach((field) => {
      if(req.body[field]) experienceFields[field] = req.body[field];

   })

   // Add experience to the model
   Profile.findOne({user: req.user.id}).then((foundProfile) => {
      foundProfile.experience.unshift(experienceFields)
      // Save
      foundProfile.save().then((saved) => res.json(saved))
   })
})


// @route   CREATE EDUCATION
// @info    Add education to user profile
// @access  Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
   var errors = {};
   // Validate input
      var validation = validateFields(req.body, require('../../validation/educationList'));
      // If not valid, return errors
      if(!validation.isValid) return res.status(400).json(validation.errors);

   // Fill object to update
   let educationFields = {};
   Object.keys(Profile.schema.obj.education[0]).forEach((field) => {
      if(req.body[field]) educationFields[field] = req.body[field];
   })
   // Add education to the model
   Profile.findOne({user: req.user.id}).then((foundProfile) => {
      foundProfile.education.unshift(educationFields)
      // Save
      foundProfile.save().then((saved) => res.json(saved))
   })
})


// @route   UPDATE EXPERIENCE
// @info    Update experience to user profile
// @access  Private
router.put('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   // Validate input
   var validation = validateFields(req.body, require('../../validation/experienceList'));
   // If not valid, return errors
   if(!validation.isValid) return res.status(400).json(validation.errors);

   Profile.findOne({user: req.user.id})
      .then((foundProfile) => {
         // Update index
         var updateIndex = foundProfile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

         // Fill object to update
         Object.keys(Profile.schema.obj.experience[0]).forEach((field) => {
            if(req.body[field]) foundProfile.experience[updateIndex][field] = req.body[field];
         })
         // Update education
         foundProfile.save().then(() => res.json({sucess: "Successfully updated experience"}))

      })
})


// @route   UPDATE EDUCATION
// @info    Update education to user profile
// @access  Private
router.put('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   // Validate input
   var validation = validateFields(req.body, require('../../validation/educationList'));
   // If not valid, return errors
   if(!validation.isValid) return res.status(400).json(validation.errors);

   Profile.findOne({user: req.user.id})
      .then((foundProfile) => {
         // Update index
         var updateIndex = foundProfile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id);

         // Fill object to update
         Object.keys(Profile.schema.obj.education[0]).forEach((field) => {
            if(req.body[field]) foundProfile.education[updateIndex][field] = req.body[field];
         })
         // Update education
         foundProfile.save().then(() => res.json({sucess: "Successfully updated education"}))

      })
})


// @route   DELETE EXPERIENCE
// @info    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   
   Profile.findOne({user: req.user.id}).then((foundProfile) => {
      // Get remove index
      let removeIndex = foundProfile.experience
         .map(item => item.id)
         .indexOf(req.params.exp_id);
      // Splice out of array
      foundProfile.experience.splice(removeIndex, 1);
      // Save
      foundProfile.save().then(profile => res.json(profile));
   }).catch(err => console.log(err));
})


// @route   DELETE EDUCATION
// @info    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Profile.findOne({user: req.user.id}).then((foundProfile) => {
      // Get remove index
      let removeIndex = foundProfile.education
         .map(item => item.id)
         .indexOf(req.params.edu_id);
      // Splice out of array
      foundProfile.education.splice(removeIndex, 1);
      // Save
      foundProfile.save().then(profile => res.json(profile));
   }).catch(err => console.log(err));
})

// @route   DELETE ACCOUNT
// @info    Delete user account and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res)=> {
   let profileDeleted
   let userDeleted
   Profile.findOneAndDelete({user: req.user.id}).then(() => {
      profileDeleted = true
      User.findByIdAndDelete(req.user.id).then(() => {
         userDeleted = true
         return res.json({sucess: profileDeleted && userDeleted, profileDeleted, userDeleted})
      }).catch(err => console.log(err))
   }).catch(err => console.log(err))
}) 


module.exports = router;