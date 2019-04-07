import React from 'react'
import PropTypes from 'prop-types'
import CommentItem from './CommentItem'



const CommentFeed = ({comments, postId, auth, deleteComment}) => (
   <div id="comments_feed">
      {comments.map((comment) => {
         return (
            <CommentItem
               key={comment._id}
               comment={comment}
               showDelete={auth.user.id === (comment.author.user && comment.author.user._id)}
               deleteComment={deleteComment.bind(this, postId, comment._id)}
            />
         ) 
      })}
   </div>
)

CommentFeed.propTypes = {
   comments: PropTypes.array.isRequired,
   postId: PropTypes.string.isRequired,
   auth: PropTypes.object.isRequired,
   deleteComment: PropTypes.func.isRequired,
}



export default CommentFeed