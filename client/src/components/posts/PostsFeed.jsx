import React, { Component } from 'react'
import PropTypes from 'prop-types'
import profileDefault from '../common/profileDefault.png'
import { connect } from 'react-redux'
import PostForm from './PostForm'
import Spinner  from '../common/Spinner/Spinner'
import PostItem from './PostItem'
// Import actions
import {getAllPosts, addPost} from '../../store/reducers/actions/postActions'

class PostsFeed extends Component {
   componentDidMount() {
      this.props.getAllPosts()
   }

   render() {
      const {all: posts, loading} = this.props.post
      const {auth} = this.props
      let postsItems

      if (posts.length === 0 || loading) {
         postsItems = <Spinner />
      } else {
         postsItems = posts.map((post) => {
            return <PostItem
               profilePic={(post.user.picture && post.user.picture.url) || profileDefault}
               key={post._id}
               post={post}
               userId={auth.user.id}
            />
         })
      }

      return (
         <div className="feed">
            <div className="container">
               <div className="row">
                  <div className="col md 12">
                     <PostForm 
                        postsLength={this.props.post.all.length}
                        addPost={this.props.addPost}
                        errors={this.props.errors}
                     />
                     <div className="posts">
                        {postsItems}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}
PostsFeed.propTypes = {
   post: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   getAllPosts: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   post: state.post,
   auth: state.auth,
   errors: state.errors,
})

const mapActionsToProps = {
   getAllPosts,
   addPost,
}

export default connect(mapStateToProps, mapActionsToProps)(PostsFeed)