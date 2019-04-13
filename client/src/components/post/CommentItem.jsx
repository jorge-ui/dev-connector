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
         <div id={`comment-${comment._id}`} className="comment-item card card-body mb-3 p-1">
            <div className="row">
               <div className="col-3 col-md-2">
                  <Link to={`/developers/${comment.author.user.handle}`}>
                     <img className="rounded-circle d-block" alt="" src={(comment.author.user.picture && comment.author.user.picture.url) || profileDefault}/>
                  </Link>
                  <Link to={`/developers/${comment.author.user.handle}`} className="text-center d-block mx-auto">{comment.author.name}</Link>
               </div>
               <div className="col-9 col-md-10">
                  <div className="container-fluid d-flex flex-column justify-content-between h-100">
                     <div className="row">
                        <p className="lead">{comment.text}</p>                  
                     </div>
                     {showDelete && (
                        <div className="row mt-auto">
                           <div className="mt-auto ml-auto">
                              <button type="button" onClick={this.onDeleteComment.bind(this)} className="wrapper btn btn-danger">
                                 {loading ? (
                                    <span className="spinner-border text-light" role="status" style={{width: '20px', height: '20px'}}>
                                       <span className="sr-only">Loading...</span>
                                    </span>
                                 ) : (
                                    <FontAwesomeIcon icon="trash-alt"/>                                 
                                 )}
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
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