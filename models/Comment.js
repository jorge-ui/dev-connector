var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Comment Shema

var commentSchema = new Schema({
   text: {
      type: String,
      required: true
   },
   author: {
      user: {
         type: Schema.Types.ObjectId,
         ref: "users"
      },
      name: {
         type: String
      }
   },
   date: {
      type: Date,
      default: Date.now
   }
})

module.exports = mongoose.model('comments', commentSchema);