import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputFieldGroup from '../common/InputFieldGroup'
import {connect} from 'react-redux'
import isEmpty from '../../validation/isEmpty'
import {clearErrors, addExperience} from '../../store/reducers/actions/profileActions'

export class ExperienceForm extends Component {
   constructor() {
      super()
      
      this.state = {
         newExperience: {
            title: "",
            company: "",
            location: "",
            from: "",
            to: "",
            current: false,
            description: ""
         }

      }
      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
   }

   onSubmit(e) {
      e.preventDefault()
      let newExperience = this.state.newExperience
      if(isEmpty(newExperience.to)) {
         newExperience.current = true
      }
      this.props.onAddExperience(newExperience)
   }

   componentWillUnmount() {
      this.props.onClearErrors()
   }

   componentWillReceiveProps(nextProps) {;
      // If current profile is empty, redirect
      if(isEmpty(nextProps.profile.current)) {
         this.props.history.push('/dashboard');
      } else {
         // If recieved errors, set them on state
         if(nextProps.errors) {
            this.setState({errors: nextProps.errors})
         }
         // Check if experience array was updated on nextProps
         if(nextProps.profile.current.experience.length > this.props.profile.current.experience.length) {            
            // Redirect upon updated
            this.props.history.push('/dashboard');
         }
      }
   }

   onChange(e) {
      if(e.target.name !== 'current') {
         this.setState({
            newExperience: {
               ...this.state.newExperience,
               [e.target.name]: e.target.value,
            }
         })
      } else {
         this.setState({
            newExperience: {
               ...this.state.newExperience,
               [e.target.name]: e.target.checked,
               to: e.target.checked ? "" : this.state.newExperience.to
            }
         })
         e.target.checked ? 
         document.querySelector('#toDate').setAttribute("disabled", "") :
         document.querySelector('#toDate').removeAttribute("disabled")
      }
   }
   

   render() {
   return (
      <div className="section add-experience">
         <div className="container">
            <div className="row">
            <div className="col-md-8 m-auto">
               <div onClick={this.props.history.goBack} className="btn btn-light">Go Back</div>
               <h1 className="display-4 text-center">Add Your Experience</h1>
               <p className="lead text-center">Add any developer/programming positions that you have had in the past</p>
               <small className="d-block pb-3">* = required field</small>
               <form onSubmit={this.onSubmit}>

                  {/* ============= title input ============*/}
                  <InputFieldGroup
                     type={"text"}
                     placeholder={"* Job Title"}
                     name={"title"}
                     value={this.state.newExperience.title}
                     onChange={this.onChange}
                     error={this.props.errors.title}                
                  />

                  {/* ============= company input ============*/}
                  <InputFieldGroup
                     type={"text"}
                     placeholder={"* Company"}
                     name={"company"}
                     value={this.state.newExperience.company}
                     onChange={this.onChange}
                     error={this.props.errors.company}              
                  />

                  {/* ============= location input ============*/}
                  <InputFieldGroup
                     type={"text"}
                     placeholder={"Location"}
                     name={"location"}
                     value={this.state.newExperience.location}
                     onChange={this.onChange}
                     error={this.props.errors.location}             
                  />

                  {/* ============= from input ============*/}
                  <InputFieldGroup
                     type={"date"}                     
                     name={"from"}
                     value={this.state.newExperience.from}
                     onChange={this.onChange}
                     error={this.props.errors.from}                 
                  />

                  {/* ============= to input ============*/}
                  <InputFieldGroup
                     type={"date"}                     
                     name={"to"}
                     value={this.state.newExperience.to}
                     onChange={this.onChange}
                     error={this.props.errors.to}
                     disabled={this.state.newExperience.current}                 
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
                     Current Job
                  </label>
                  </div>

                  {/* ============= description input ============*/}
                  <InputFieldGroup
                     type={"textarea"}
                     placeholder={"Job Description"}
                     name={"description"}
                     value={this.state.newExperience.description}
                     onChange={this.onChange}
                     error={this.props.errors.description}
                     small={"Some of your responsabilities, etc"}
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

ExperienceForm.propTypes = {
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired,
   onClearErrors: PropTypes.func.isRequired,
   onAddExperience: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   errors: state.errors,
   profile: state.profile
})

const mapActionsToProps = {
   onClearErrors: clearErrors,
   onAddExperience: addExperience
}

export default connect(mapStateToProps, mapActionsToProps)(ExperienceForm)