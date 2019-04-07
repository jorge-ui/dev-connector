var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var validateFields = require('../../validation/validateFields');
var Comment = require('../../models/Comment')
var cloudinary = require('cloudinary').v2

// Model
var Post = require('../../models/Post');
var Profile = require('../../models/Profile');


// @route   INDEX api/posts/
// @info    Get all posts
// @access  Public
router.get('/', (req, res) => {
   Post.find()
      .populate({
         path: 'user',
         select: 'picture handle name _id'
      })
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
   // Validate post
   var validation = validateFields(req.body, require('../../validation/postList'));
   if(!validation.isValid) {
      return res.status(400).json(validation.errors)
   }
   // Make new post object
   var newPost = {};
   Object.keys(Post.schema.obj).forEach((field) => {
      // Skip these fields
      if(field === 'user' || field === 'comments' || field === 'likes' || field === 'author') return;
      else newPost[field] = req.body[field];
   })
   // Associate user with post
   newPost.user = req.user.id;
   newPost.author = req.user.name;

   // Save to datase
   Post.create(newPost)
      .then(post => {
         post.populate({
            path: 'user',
            select: 'picture handle name _id'
         }).execPopulate()
            .then((post) => res.json(post))
      })
      .catch(err => console.log(err));
})

// @route   SHOW api/posts/:id
// @info    Get single post
// @access  Public
router.get('/:id', (req, res) => {
   Post.findById(req.params.id)
      .populate({
         path: 'comments',
         options: { sort: { date: -1 } },
         populate: { // 2nd level subdoc (get users in comments)
            path: "author.user",
            select: 'picture handle name _id'// space separated (selected fields only)
         }
      })
      .populate('user')
      .then(post => {
         res.json(post)
      })
      .catch(err => {
         console.log(err);
         res.status(404).json({nopost: "No post found"});
      })
})

// @route   UPDATE api/posts
// @info    Update a post
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

// @route   add/remove Like
// @info    add or remove (toggle) like on post
// @acccess Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   const likeId = req.user.id
   Post.findById(req.params.id)
      .then((foundPost) => {
         const {likes} = foundPost
         // Check if user has liked post
         if(likes.some((id) => {return id.toString() === likeId})) {
            // Remove like
            likes.splice(likes.indexOf(likeId), 1)
            // Save post
            foundPost.save().then((savedPost) => {
               // Return updated likes array
               return res.status(201).json(savedPost.likes)
            })
         } else {
            // Add like
            likes.push(likeId)
            // Save post
            foundPost.save().then((savedPost) => {
               // Return updated likes array
               return res.status(201).json(savedPost.likes)
            })
         }
      })
})

// @route   DELETE api/posts/:id
// @info    Delete single post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Post.findById(req.params.id)
      .then((foundPost) => {
         // Check for post ownership
         if(foundPost.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: "User is not authorized"})
         } else {
            // Delete associeted comments
            foundPost.comments.forEach((comment_id) => {
               Comment.findByIdAndDelete(comment_id)
            });
            // Delete
            foundPost.delete().then(() => res.json({success: "Post was deleted"}));
         }
      }).catch(err => console.log(err))
})





module.exports = router;