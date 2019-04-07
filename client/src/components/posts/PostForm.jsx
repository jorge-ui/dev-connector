import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputFieldGroup from '../common/InputFieldGroup'


class PostForm extends Component {
   constructor(props) {
      super(props)
      this.state = {
         newPost: {
            body: ''
         },
         errors: {}
      }
      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
   }

   onKeyDown(e) {
      if(e.key === 'Enter') {
         e.preventDefault()
         this.onSubmit()
         this.setState({
            newPost: {
               body: ''
            }
         })
      }
   }

   componentWillReceiveProps(nextProps) {
      if(nextProps.errors) {
         this.setState({
            errors: nextProps.errors
         })
      }
      if(nextProps.postsLength > this.props.postsLength) {
         this.setState({
            newPost: {
               body: ''
            }
         })
      }
   }

   onChange(e) {
      this.setState({
         newPost: {
            body: e.target.value
         }
      })
   }

   onSubmit(e) {
      e && e.preventDefault()
      this.props.addPost(this.state.newPost)
   }
   
   render() {
      const {errors} = this.state
      return (
         <div className="post-form mb-3">
            <div className="card card-info">
               <div className="card-header bg-info text-white">
                  Say Somthing...
               </div>
               <div className="card-body">
                  <form onSubmit={this.onSubmit}>
                     <div className="form-group">
                     <InputFieldGroup 
                        type={"textarea"}
                        placeholder={"Create a post"}
                        name={"body"}
                        value={this.state.newPost.body}
                        onChange={this.onChange}
                        error={errors.body}
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

PostForm.propTypes = {
   addPost: PropTypes.func.isRequired,
   errors: PropTypes.object,
   postsLength: PropTypes.number.isRequired,
}

export default PostForm