var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var validateFields = require('../../validation/validateFields');
var Comment = require('../../models/Comment')

// Model
var Post = require('../../models/Post');
var Profile = require('../../models/Profile');


// @route   INDEX api/posts/
// @info    Get all posts
// @access  Public
router.get('/', (req, res) => {
   Post.find()
      .sort({date: -1})
      .then(posts => res.json(posts))
      .catch(err => {
         console.log(err);
         res.status(404).json({noposts: "No posts found"});
      })
})

// @route   CREATE api/posts
// @info    Create new post
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   // TODO: validate post
   var validation = validateFields(req.body, require('../../validation/postList'));
   if(!validation.isValid) {
      return res.status(400).json(validation.errors)
   }
   // TODO: make new post object
   var newPost = {};
   // Associate user with post
   newPost.user = req.user.id;
   Object.keys(Post.schema.obj).forEach((field) => {
      // Skip these fields
      if(field === 'user' || field === 'comments' || field === 'likes') return;
      else newPost[field] = req.body[field];
   })
   // TODO: save to datase
   Post.create(newPost).then(post => res.json(post))
      .catch(err => console.log(err));
})

// @route   SHOW api/posts/
// @info    Get single post
// @access  Public
router.get('/:id', (req, res) => {
   Post.findById(req.params.id)
      .populate("comments")
      .then(post => res.json(post))
      .catch(err => {
         console.log(err);
         res.status(404).json({nopost: "No post found"});
      })
})

// @route   UPDATE api/posts
// @info    Update user post
// @access  Private
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   // Validate post
   var validation = validateFields(req.body, require('../../validation/postList'));
   if(!validation.isValid) {
      return res.status(400).json(validation.errors)
   }
   Post.findById(req.params.id)
      .then((foundPost) => {
         // Check for post ownership
         if(foundPost.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: "User is not authorized"})
         } else {
            // Update and save
            foundPost.body = req.body.body;
            foundPost.save()
            .then(() => res.json({sucess: "Successfully updated post"}))
            .catch(err => console.log(err));

         }
      }).catch(err => console.log(err))
})

// @route   DELETE api/posts/:id
// @info    Delete single post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Profile.findOne({user: req.user.id})
      .then((foundProfile) => {
         Post.findById(req.params.id)
            .then((foundPost) => {
               // Check for post ownership
               if(foundPost.user.toString() !== req.user.id) {
                  return res.status(401).json({ notauthorized: "User is not authorized"})
               } else {
                  // Delete associeted comments
                  foundPost.comments.forEach((comment_id) => {
                     Comment.findByIdAndDelete(comment_id)
                     .then(() => console.log('A comments was delted'))
                  });
                  // Delete
                  foundPost.delete().then(() => res.json({suceess: "Post was deleted"}));
               }
            }).catch(err => console.log(err))
      }).catch(err => console.log(err))
})





module.exports = router;