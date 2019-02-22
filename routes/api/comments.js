var express = require('express');
var router = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var passport = require('passport');
var Comment = require('../../models/Comment');
var Post = require('../../models/Post');
var isEmpty = require('../../validation/isEmpty');

// Create
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   // Validate comment
   if(isEmpty(req.body.text)) {
      return res.status(400).json({nocomment: "Comment can't be empty"});
   } else {
      // Make comment object
      var newComment = {};
      newComment.text = req.body.text;
      newComment.author = {
         id: req.user.id,
         name: req.user.name
      }

      // Create comment
      Comment.create(newComment)
         .then((comment) => {
            // Find post to associate
            Post.findById(req.params.id)
               .then((foundPost) => {
                  // Push comment to post's comment array
                  foundPost.comments.push(comment)
                  // Save post
                  foundPost.save().then((savedPost) => {
                     res.json(savedPost)
                  }).catch(err => console.log(err));
               })
               .catch(err => console.log(err));
         })
   }
})

// Update
router.put('/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   // Validate comment
   if(isEmpty(req.body.text)) {
      return res.status(400).json({nocomment: "Comment can't be empty"});
   } else {
      Comment.findById(req.params.comment_id)
      .then((comment) => {
         if(comment.author.id.toString() === req.user.id) {
            comment.text = req.body.text;
            comment.save()
            .then(() => res.json({success: "Successfully updated"}))
            .catch(err => console.log(err));
         } else {
            res.status(400).json({error: "Unathorized"})
         }
      })
      .catch(err => console.log(err));
   }
})

// Delete
router.delete('/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Comment.findById(req.params.comment_id)
      .then((comment) => {
         if(comment.author.id.toString() === req.user.id) {
            comment.delete().then(() => res.json({success: "Comment was deleted"}))
         } else res.status(400).json({error: "Unathorized"})
      })
}) 


module.exports = router;