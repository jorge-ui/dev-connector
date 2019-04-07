import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import dateFormat from 'dateformat'
import { connect } from 'react-redux'
import {deletePost, toggleLike} from '../../store/reducers/actions/postActions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class PostItem extends Component {
   constructor(props) {
      super(props)
      this.state = {
            isLiked: props.post.likes.includes(props.userId),
            likeLoading: false,
            deleteLoading: false
      }
   }

   componentWillReceiveProps(newProps) {
      if(newProps.post.likes.length !== this.props.post.likes.length) {
         this.setState({
            likeLoading: false
         })
      }
   }
   
   onDeleteClick(id) {
      this.setState({
         deleteLoading: true
      })
      this.props.deletePost(id)
   }

   onLikeClick(id, isLiked) {
      this.setState({
         likeLoading: true
      })
      this.props.toggleLike(id, isLiked)
   }
   
   render() {
      const {post, userId, showButtons, profilePic} = this.props
      const {deleteLoading} = this.state
      let isLiked = post.likes.includes(userId)
      
      return (
      <div className="card card-body mb-3">
            <div className="row">
               <div className="col-12 col-md-2">
                  <div className="square" id='profilePic'>
                     <img className="rounded-circle d-block squareImg" alt="profilePic" src={profilePic}/>
                  </div>
                  <br/>
                  <Link to={`/developers/${post.user.handle}`} className="text-center mx-auto d-block position-absolute w-100 pr-4">{post.user.name}</Link>
               </div>
               <div className="col-10 col-md-10">
               <p className="text-right text-muted"><em>{dateFormat(post.date, "mmmm dS, yyyy, h:MM TT")}</em></p>
               <p className="lead">{post.body}</p>
               {showButtons && (<span id="buttons" style={{height: '15px'}}>
                  {/* Like button */}
                  <span className="wrapper">
                     <button onClick={this.onLikeClick.bind(this, post._id, isLiked)} className="btn btn-light mr-1" type="button">
                        {this.state.likeLoading ? 
                           <FontAwesomeIcon icon="spinner" spin/> :
                           <FontAwesomeIcon icon="thumbs-up" className={isLiked ? "text-info" : "text-secondary"}/>                     
                        }                        
                        <span className="badge badge-light" style={{backgroundColor: '#00000000'}}>{post.likes.length}</span>
                     </button>
                  </span>
                  <Link className="btn btn-info mr-1" to={`post/${post._id}`}>
                     Comments
                  </Link>
                  {(post.user._id === userId) && (
                     <button type="button" onClick={this.onDeleteClick.bind(this, post._id)} className="wrapper btn btn-danger mr-1">
                        {deleteLoading ? (
                           <span className="spinner-border text-light" role="status" style={{width: '20px', height: '20px'}}>
                              <span className="sr-only">Loading...</span>
                           </span>
                        ) : (
                           <FontAwesomeIcon icon="trash-alt"/>                                 
                        )}
                     </button>
                  )}
               </span>)}
               </div>
            </div>
         </div>
      )
   }
}

PostItem.defaultProps = {
   showButtons: true
}

PostItem.propTypes = {
   post: PropTypes.object.isRequired,
   userId: PropTypes.string,
   profilePic: PropTypes.string,
   deletePost: PropTypes.func.isRequired,
   toggleLike: PropTypes.func.isRequired,
}


export default connect(null, {deletePost, toggleLike})(PostItem)