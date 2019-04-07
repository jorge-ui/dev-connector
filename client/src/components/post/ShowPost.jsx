import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import profileDefault from '../common/profileDefault.png'
import {Link} from 'react-router-dom'
import {getPost, clearPost, deleteComment} from '../../store/reducers/actions/postActions'
import Spinner from '../common/Spinner/Spinner'
import PostItem from '../posts/PostItem'
import CommentForm from './CommentForm'
import CommentFeed from './CommentFeed'

class ShowPost extends Component {
   
   componentWillUnmount() {
      this.props.clearPost()
   }
   componentDidMount() {
      this.props.getPost(this.props.match.params.id)
   }
   render() {
      const {current: post, loading} = this.props.post
      const {auth, deleteComment} = this.props
      let postContent;
      let noRender = post === null || loading || Object.keys(post).length === 0

      if(noRender) {
         postContent = <Spinner/>
      } else {
         postContent = (
            <div id="show-post">
               <PostItem
                  profilePic={(post.user.picture && post.user.picture.url) || profileDefault}
                  post={post}
                  showButtons={false}
               />
               <CommentForm
                  postId={post._id}
                  commentsLength={post.comments.length}
               />
               <CommentFeed 
                  comments={post.comments}
                  postId={post._id}
                  auth={auth}
                  deleteComment={deleteComment}
               />
            </div>
         )
      }

      return (
         <div className="post">
            <div className="container">
               <div className="row">
                  <div className="col-md-12">
                     <Link to="/feed" className="btn btn-light mb-3" >
                        Back to Feed
                     </Link>
                     {postContent}                     
                  </div>
               </div>
            </div>
         </div>
      )
   }
}


ShowPost.propTypes = {
   getPost: PropTypes.func.isRequired,
   clearPost: PropTypes.func.isRequired,
   deleteComment: PropTypes.func.isRequired,
   post: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
   post: state.post,
   auth: state.auth,
})

const mapActionsToProps = {
   getPost,
   clearPost,
   deleteComment,
}

export default connect(mapStateToProps, mapActionsToProps)(ShowPost)