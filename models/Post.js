var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post schema
const PostSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
   },
   body: {
      type: String,
      required: true
   },
   author: {
      type: String
   },
   likes: [
      {
         user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
         }
      }
   ],
   comments: [
      {
         type: Schema.Types.ObjectId,
         ref: 'comments'
      }
   ],
   date: {
      type: Date,
      default: Date.now
   }
})

module.exports = mongoose.model('posts', PostSchema);