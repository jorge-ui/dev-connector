import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import InputFieldGroup from '../common/InputFieldGroup'
import {addComment} from '../../store/reducers/actions/postActions'


class CommentForm extends Component {
   constructor(props) {
      super(props)
      this.state = {
         newComment: {
            text: ''
         },
         errors: {}
      }
      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
   }

   componentWillReceiveProps(nextProps) {
      if(nextProps.errors) {
         this.setState({
            errors: nextProps.errors
         })
      }
      if(nextProps.commentsLength > this.props.commentsLength) {
         this.setState({
            newComment: {
               text: ''
            }
         })
      }
   }

   onChange(e) {
      this.setState({
         newComment: {
            text: e.target.value
         }
      })
   }

   onKeyDown(e) {
      if(e.key === 'Enter') {
         e.preventDefault()
         this.onSubmit()
         this.setState({
            newComment: {
               text: ''
            }
         })
      }
   }


   onSubmit(e) {
      e && e.preventDefault()
      this.props.addComment(this.state.newComment, this.props.postId)
   }
   
   render() {
      const {errors} = this.state
      return (
         <div className="post-form mb-3">
            <div className="card card-info">
               <div className="card-header bg-info text-white">
               Make a comment...
               </div>
               <div className="card-body">
                  <form onSubmit={this.onSubmit}>
                     <div className="form-group">
                     <InputFieldGroup 
                        type={"textarea"}
                        placeholder={"Reply to post"}
                        name={"text"}
                        value={this.state.newComment.text}
                        onChange={this.onChange}
                        error={errors.nocomment}
                        rows={3}
                        onKeyDown={this.onKeyDown.bind(this)}
                     />
                     </div>
                     <input type="submit" className="btn btn-dark"/>
                  </form>
               </div>
            </div>
         </div>
      )
   }
}

CommentForm.propTypes = {
   addComment: PropTypes.func.isRequired,
   errors: PropTypes.object,
   postId: PropTypes.string.isRequired,
   commentsLength: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => ({
   errors: state.errors,
})

const mapActionsToProps = {
   addComment,
}

export default connect(mapStateToProps, mapActionsToProps)(CommentForm)