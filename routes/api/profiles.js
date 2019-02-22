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

// @route   INDEX
// @info    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
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
            res.json(foundProfile); // return profile
         }
      })
      .catch(err => res.status(404).json(err)); // error finding profile
})

// @route   CREATE
// @info    Crate current user profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   var errors = {};
   // Empty profile fields obj
   var profileFields = {};
   // Associate user with profile
   profileFields.user = req.user.id;
   // Validate input
   var validation = validateFields(req.body, require('../../validation/profileList'));
   // If not valid, return errors
   if(!validation.isValid) return res.status(400).json(validation.errors);

   // Fill profileFields object
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
            Object.keys(Profile.schema.obj.social).forEach((socialLink) => {
               // Fill the social obejct for each social link found in body field
               if (req.body[socialLink]) profileFields.social[socialLink] = req.body[socialLink];
            })
            break;
         default: // Defult check field in body and add to profileFields
            if (req.body[key]) profileFields[key] = req.body[key];
      }
   })

   // Check id handle exist
   Profile.findOne({handle: profileFields.handle}).then((foundProfile) => {
      if(foundProfile) {
         errors.handle = 'That handle alredy exist';
         return res.status(400).json(errors); // Handle already exist
      } else {
         // Create profile
         Profile.create(profileFields)
            .then((profile) => res.json(profile))// Success creating profile
            .catch(err => console.log(err));
      }
   }).catch((err) => console.log(err))
})


// @route   SHOW
// @info    Get current profile by handle
// @access  Public
router.get('/:handle', (req, res) => {
   const errors = {};
   
   Profile.findOne({handle: req.params.handle})
      .then((foundProfile) => {
         if(!foundProfile) {
            errors.noProfile = 'There is no profile for this user';
            return res.status(400).json(errors);
         } else {
            res.json(foundProfile);
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
            Object.keys(Profile.schema.obj.social).forEach((socialLink) => {
               // Fill the social obejct for each social link found in body field
               if (req.body[socialLink]) profileFields.social[socialLink] = req.body[socialLink];
            })
            break;
         default: // Defult check field in body and add to profileFields
            if (req.body[key]) profileFields[key] = req.body[key];
      }
      if (req.body.handle) profileFields.handle
   })

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


module.exports = router;