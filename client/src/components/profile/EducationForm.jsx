import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputFieldGroup from '../common/InputFieldGroup'
import {connect} from 'react-redux'
import isEmpty from '../../validation/isEmpty'
import {clearErrors, addEducation} from '../../store/reducers/actions/profileActions'

export class EducationForm extends Component {
   constructor(props) {
      super(props)
      
      this.state = {
         newEducation: {
            school: "",
            degree: "",
            fieldofstudy: "",
            from: "",
            to: "",
            current: false,
         }

      }
      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
   }

   onSubmit(e) {
      e.preventDefault()
      let newEducation = this.state.newEducation
      if(isEmpty(newEducation.to)) {
         newEducation.current = true
      }
      this.props.onAddEducation(newEducation)
   }

   componentWillUnmount() {
      this.props.onClearErrors()
   }

   componentWillReceiveProps(nextProps) {
      // If current profile is empty, redirect
      if(isEmpty(nextProps.profile.current)) {
         this.props.history.push('/dashboard');
      } else {
         // If errors, set them on state
         if(nextProps.errors) {
            this.setState({errors: nextProps.errors})
         }
         // Check if education array was updated on nextProps
         if(nextProps.profile.current.education.length > this.props.profile.current.education.length) {            
            // Redirect upon updated
            this.props.history.push('/dashboard');
         }
      }
   }

   onChange(e) {
      if(e.target.name !== 'current') {
         this.setState({
            newEducation: {
               ...this.state.newEducation,
               [e.target.name]: e.target.value,
            }
         })
      } else {
         this.setState({
            newEducation: {
               ...this.state.newEducation,
               [e.target.name]: e.target.checked,
               to: e.target.checked ? "" : this.state.newEducation.to
            }
         })
         e.target.checked ? 
         document.querySelector('#toDate').setAttribute("disabled", "") :
         document.querySelector('#toDate').removeAttribute("disabled")
      }
   }
   

   render() {
   return (
      <div className="section add-education">
         <div className="container">
            <div className="row">
            <div className="col-md-8 m-auto">
               <div onClick={this.props.history.goBack} className="btn btn-light">Go Back</div>
               <h1 className="display-4 text-center">Add Your Education</h1>
               <p className="lead text-center">Add any school, bootcamp, etc that you have attended</p>
               <small className="d-block pb-3">* = required field</small>
               <form onSubmit={this.onSubmit}>

                  {/* ============= school input ============*/}
                  <InputFieldGroup
                     type={"text"}
                     placeholder={"* School Or Bootcamp"}
                     name={"school"}
                     value={this.state.newEducation.school}
                     onChange={this.onChange}
                     error={this.props.errors.school}                
                  />

                  {/* ============= degree input ============*/}
                  <InputFieldGroup
                     type={"text"}
                     placeholder={"* Degree Or Certificate"}
                     name={"degree"}
                     value={this.state.newEducation.degree}
                     onChange={this.onChange}
                     error={this.props.errors.degree}              
                  />

                  {/* ============= fieldofstudy input ============*/}
                  <InputFieldGroup
                     type={"text"}
                     placeholder={"Field Of Study"}
                     name={"fieldofstudy"}
                     value={this.state.newEducation.fieldofstudy}
                     onChange={this.onChange}
                     error={this.props.errors.fieldofstudy}             
                  />

                  {/* ============= from input ============*/}
                  <InputFieldGroup
                     type={"date"}                     
                     name={"from"}
                     value={this.state.newEducation.from}
                     onChange={this.onChange}
                     error={this.props.errors.from}                 
                  />

                  {/* ============= to input ============*/}
                  <InputFieldGroup
                     type={"date"}                     
                     name={"to"}
                     value={this.state.newEducation.to}
                     onChange={this.onChange}
                     error={this.props.errors.to}
                     id={"toDate"}
                  />

                  {/* ============= current input ============*/}
                  <div className="form-check mb-4">
                  <input className="form-check-input"
                     type="checkbox"
                     name="current"
                     onChange={this.onChange}
                     id="current"
                  />
                  <label className="form-check-label" htmlFor="current">
                     Current
                  </label>
                  </div>

                  {/* ============= description input ============*/}
                  <InputFieldGroup
                     type={"textarea"}
                     placeholder={"Program Description"}
                     name={"description"}
                     value={this.state.newEducation.description}
                     onChange={this.onChange}
                     error={this.props.errors.description}
                     small={"Tell us about your experience and what you learned"}
                  />
                  
                  <input type="submit" className="btn btn-info btn-block mt-4" />
               </form>
            </div>
            </div>
         </div>
      </div>
   )
   }
}

EducationForm.propTypes = {
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired,
   onClearErrors: PropTypes.func.isRequired,
   onAddEducation: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   errors: state.errors,
   profile: state.profile
})

const mapActionsToProps = {
   onClearErrors: clearErrors,
   onAddEducation: addEducation
}

export default connect(mapStateToProps, mapActionsToProps)(EducationForm)