import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import InputFieldGroup from '../common/InputFieldGroup';
import {createProfile, updateProfile} from '../../store/reducers/actions/profileActions'
import isEmpty from '../../validation/isEmpty'
import {clearErrors} from '../../store/reducers/actions/profileActions'

var newEmptyProfile = {
   handle: "",
   status: "",
   company: "",
   website: "",
   location: "",
   skills: "",
   githubUsername: "",
   bio: "",
   twitter: "",
   facebook: "",
   linkedin: "",
   youtube: "",
   instagram: "",
}


class ProfileForm extends Component {

   constructor(props) {
      super(props)
      this.state = {
         newProfile: {...newEmptyProfile},
         forUpdate: !isEmpty(this.props.profile.current),
         statusOptions: [],
         displaySocial: false
      }

      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
      this.toggleSocialLinks = this.toggleSocialLinks.bind(this)
   }

   componentDidMount() {
      //Fill status otions if empty
      if(isEmpty(this.state.statusOptions)) {
         this.setState({statusOptions: [
            this.state.forUpdate ? this.props.profile.current.status : "",
            "Developer",
            "Junior Developer",
            "Senior Developer",
            "Manager",
            "Student or Learning",
            "Instructor",
            "Intern",
            "Other",
         ]})         
      }
      // For update state
      if(this.state.forUpdate) {
         let profileData = Object.entries(newEmptyProfile).reduce((finish, field) => {
               //social fields to fill
               if(field[0] === "twitter" || field[0] === "facebook" || field[0] === "linkedin" || field[0] === "youtube" || field[0] === "instagram") {
                  return {...finish, [field[0]]: this.props.profile.current.social ? this.props.profile.current.social[field[0]] : ""}
               } 
               // non-social fields to fill
               else {
                  return {...finish, [field[0]]: this.props.profile.current[field[0]]}
               }
            }, {})
         this.setState({
            newProfile: {...profileData, skills: profileData.skills.join()},
            oldProfile: {...profileData, skills: profileData.skills.join()},
         })
      }
   }

   toggleSocialLinks() {
      this.setState({
         displaySocial: !this.state.displaySocial
      })
   }

   componentWillUnmount() {
      this.props.onClearErrors()
   }

   componentWillReceiveProps(nextProps) {
      
      if(nextProps.errors) {
         this.setState({errors: nextProps.errors})
      }
      if(!isEmpty(nextProps.profile.current)) {
         if(this.state.forUpdate) {
            if(nextProps.profile.current !== this.props.profile.current) {               
               this.props.history.push('/dashboard');
            }
         } else {
            this.props.history.push('/dashboard');
         }
      }
   }

   onChange(e) {
      this.setState({newProfile: {...this.state.newProfile, [e.target.name]: e.target.value}})
   }

   onSubmit(e) {
      e.preventDefault()
      const newProfile = this.state.newProfile
      // Create or Update?
      if(this.state.forUpdate) {
         this.props.onUpdateProfile(newProfile)
      } else {
         this.props.onCreateProfile(newProfile)
      }
   }

   render() {
      const {forUpdate, statusOptions} = this.state
      return (
         <div className="create-profile">
         <div className="container">
            <div className="row">
            <div className="col-md-8 m-auto">
               <div onClick={this.props.history.goBack} className="btn btn-light">Go Back</div>
               <h1 className="display-4 text-center">{forUpdate ? "Edit" : "Create"} Your Profile</h1>
               {!forUpdate && <p className="lead text-center">Let's get some information to make your profile stand out</p>}
               {!forUpdate && <small className="d-block pb-3">* = required field</small>}
               <form onSubmit={this.onSubmit}>

                  {/* ====== handle input ====== */}
                  {!forUpdate && <InputFieldGroup 
                     type={"text"}
                     placeholder={"* Profile handle"}
                     name={"handle"}
                     value={this.state.newProfile.handle}
                     onChange={this.onChange}
                     error={this.props.errors.handle}
                     small={"A unique handle for your profile URL. Your full name, company name, nickname, etc (This CAN'T be changed later)"}
                  />}

                  {/* ====== status input ====== */}
                  <div className="form-group">
                     <select onChange={this.onChange} className={classnames('form-control form-control-lg', {
                        'is-invalid': this.props.errors.status
                     })} name="status">
                        {
                           [...new Set(statusOptions)].map((status) => {
                              return (<option key={this.state.statusOptions.indexOf(status)} value={status}>{status ? status : "* Select Professional Status"}</option>)
                           })
                        }
                     </select>
                     {this.props.errors.status && (<div className='invalid-feedback'>{this.props.errors.status}</div>)}
                     <small className="form-text text-muted">Give us an idea of where you are at in your career</small>
                  </div>

                  {/* ====== company input ====== */}
                  <InputFieldGroup 
                     type={"text"}
                     placeholder={"Company"}
                     name={"company"}
                     value={this.state.newProfile.company}
                     onChange={this.onChange}
                     error={this.props.errors.company}
                     small={"Could be your own company or one you work for"}
                  />

                  {/* ====== website input ====== */}
                  <InputFieldGroup 
                     type={"text"}
                     placeholder={"Website"}
                     name={"website"}
                     value={this.state.newProfile.website}
                     onChange={this.onChange}
                     error={this.props.errors.website}
                     small={"Could be your own or a company website"}
                  />

                  {/* ====== location input ====== */}
                  <InputFieldGroup 
                     type={"text"}
                     placeholder={"Location"}
                     name={"location"}
                     value={this.state.newProfile.location}
                     onChange={this.onChange}
                     error={this.props.errors.location}
                     small={"City & state suggested (eg. Boston, MA)"}
                  />

                  {/* ====== skills input ====== */}
                  <InputFieldGroup 
                     type={"text"}
                     placeholder={"Skills"}
                     name={"skills"}
                     value={this.state.newProfile.skills}
                     onChange={this.onChange}
                     error={this.props.errors.skills}
                     small={"Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)"}
                  />

                  {/* ====== githubusername input ====== */}
                  <InputFieldGroup 
                     type={"text"}
                     placeholder={"Github Username"}
                     name={"githubUsername"}
                     value={this.state.newProfile.githubUsername}
                     onChange={this.onChange}
                     error={this.props.errors.githubUsername}
                     small={"If you want your latest repos and a Github link, include your username"}
                  />

                  {/* ====== bio input ====== */}
                  <InputFieldGroup 
                     type={"textarea"}
                     placeholder={"A short bio of yourself"}
                     name={"bio"}
                     value={this.state.newProfile.bio}
                     onChange={this.onChange}
                     error={this.props.errors.bio}
                     small={"Tell us a little about yourself"}
                  />
      
                  <div className="mb-3">
                     <button onClick={this.toggleSocialLinks} type="button" className="btn btn-light">Add Social Network Links</button>
                     <span className="text-muted"> Optional</span>
                  </div>
                  
                  {this.state.displaySocial && (<div id="socialLinks">
                     {/* ====== twitter input ====== */}
                     <InputFieldGroup 
                        type={"text"}
                        placeholder={"Twitter Profile URL"}
                        name={"twitter"}
                        value={this.state.newProfile.twitter}
                        onChange={this.onChange}
                        error={this.props.errors.twitter}
                        social={"twitter"}
                     />
   
                     {/* ====== facebook input ====== */}
                     <InputFieldGroup 
                        type={"text"}
                        placeholder={"Facebook Page URL"}
                        name={"facebook"}
                        value={this.state.newProfile.facebook}
                        onChange={this.onChange}
                        error={this.props.errors.facebook}
                        social={"facebook"}
                     />
   
                     {/* ====== linkedin input ====== */}
                     <InputFieldGroup 
                        type={"text"}
                        placeholder={"Linkedin Profile URL"}
                        name={"linkedin"}
                        value={this.state.newProfile.linkedin}
                        onChange={this.onChange}
                        error={this.props.errors.linkedin}
                        social={"linkedin"}
                     />
   
                     {/* ====== youtube input ====== */}
                     <InputFieldGroup 
                        type={"text"}
                        placeholder={"YouTube Channel URL"}
                        name={"youtube"}
                        value={this.state.newProfile.youtube}
                        onChange={this.onChange}
                        error={this.props.errors.youtube}
                        social={"youtube"}
                     />
   
                     {/* ====== instagram input ====== */}
                     <InputFieldGroup 
                        type={"text"}
                        placeholder={"Instagram Page URL"}
                        name={"instagram"}
                        value={this.state.newProfile.instagram}
                        onChange={this.onChange}
                        error={this.props.errors.instagram}
                        social={"instagram"}
                     />
                  </div>)}

                  <button
                     className={classnames("btn btn-block mt-4", {
                        "btn-info": !forUpdate,
                        "btn-warning": forUpdate
                     })}
                     type="submit"
                  >{forUpdate ? "Update" : "Submit"}</button>

               </form>
            </div>
            </div>
         </div>
      </div>
      )
   }
}

ProfileForm.propTypes = {
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired,
   onCreateProfile: PropTypes.func.isRequired,
   onClearErrors: PropTypes.func.isRequired,
   onUpdateProfile: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   errors: state.errors,
   profile: state.profile
})

const mapActionsToProps = {
   onCreateProfile: createProfile,
   onClearErrors: clearErrors,
   onUpdateProfile: updateProfile
}


export default connect(mapStateToProps, mapActionsToProps)(ProfileForm)