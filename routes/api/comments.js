var express = require('express');
var router = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var passport = require('passport');
var Comment = require('../../models/Comment');
var Post = require('../../models/Post');
var isEmpty = require('../../validation/isEmpty');

// @route   POST api/post/:id/comments
// @info    add a comment and associate with post
// @acccess Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   // Validate comment
   if(isEmpty(req.body.text)) {
      return res.status(400).json({nocomment: "Comment can't be empty"});
   } else {
      // Make comment object
      var newComment = {};
      newComment.text = req.body.text;
      newComment.author = {
         user: req.user.id,
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
                  foundPost.save().then(() => {
                     comment.populate({
                        path: 'author.user',
                        select: 'picture name _id',
                        model: 'users'
                     }).execPopulate()
                        .then(comment => {
                           res.status(201).json(comment)
                        })
                     
                  }).catch(err => console.log(err));
               })
               .catch(err => console.log(err));
         })
   }
})

// @route   PUT api/post/:id/comments/:comment_id
// @info    update an existing comment
// @acccess Private
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
            //Success, responde with saved comment
            .then((savedComment) => res.json(savedComment))
            .catch(err => console.log(err));
         } else {
            res.status(400).json({error: "Unathorized"})
         }
      })
      .catch(err => console.log(err));
   }
})

// @route   DELETE api/post/:id/comments/:comment_id
// @info    delete a comment
// @acccess Private
router.delete('/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   const {id: postId, comment_id: commentId} = req.params
   Post.findById(postId)
      .then((foundPost) => {
         const {comments} = foundPost
         comments.splice(comments.indexOf(commentId), 1)
         foundPost.save().then(() => {
            Comment.findById(commentId)
               .then((comment) => {
                  if(comment.author.user._id.toString() === req.user.id) {
                     comment.delete().then(() => res.json({success: "Comment was deleted"}))
                  } else res.status(401).json({error: "Unathorized"})
               })
         })
      })
}) 


module.exports = router;