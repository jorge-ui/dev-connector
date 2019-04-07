import React, {Component} from 'react'
import profileDefault from '../common/profileDefault.png'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'

class CommentItem extends Component {
   constructor(props) {
      super(props)
      this.state = {
         loading: false
      }
   }
   
   onDeleteComment() {
      this.setState({
         loading: true
      })
      this.props.deleteComment()
   }
   render() {
      const {comment, showDelete} = this.props
      const {loading} = this.state
      return (
         <div className="comment-item card card-body mb-3">
            <div className="row">
               <div className="col-md-2">
                  <Link to={`/developers/${comment.author.user.handle}`}>
                     <div className="square">
                        <img className="rounded-circle d-none d-md-block squareImg" alt="" src={(comment.author.user.picture && comment.author.user.picture.url) || profileDefault}/>
                     </div>
                  </Link>
                  <br/>
                  <Link to={`/developers/${comment.author.user.handle}`} className="text-center d-block mx-auto">{comment.author.name}</Link>
               </div>
               <div className="col-md-10">
                  <p className="lead">{comment.text}</p>
                  {showDelete && (
                     <div>
                        <button type="button" onClick={this.onDeleteComment.bind(this)} className="wrapper btn btn-danger mr-1">
                           {loading ? (
                              <span className="spinner-border text-light" role="status" style={{width: '20px', height: '20px'}}>
                                 <span className="sr-only">Loading...</span>
                              </span>
                           ) : (
                              <FontAwesomeIcon icon="trash-alt"/>                                 
                           )}
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )
   }
}


CommentItem.propTypes = {
   comment: PropTypes.object.isRequired,
   showDelete: PropTypes.bool.isRequired,
   deleteComment: PropTypes.func.isRequired,
}


export default CommentItem