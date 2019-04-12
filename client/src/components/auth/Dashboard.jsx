import React, { Component } from 'react'
import dateFormat from 'dateformat'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {getCurrentProfile, deleteExperience, deleteEducation, deleteAccount} from '../../store/reducers/actions/profileActions'
import {uploadPicture, deletePicture} from '../../store/reducers/actions/authActions'
import isEmpty from '../../validation/isEmpty'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
//import dumb components
import ExperienceRow from '../common/ExperienceRow'
import EducationRow from '../common/EducationRow'
import Spinner from '../common/Spinner/Spinner'
import ProfileLinks from './ProfileLinks'
import UploadModal from './UploadModal'


class Dashboard extends Component {
   constructor() {
      super()
      this.deleteExperience = this.deleteExperience.bind(this)
      this.deleteEducation = this.deleteEducation.bind(this)
      this.deleteClick = this.deleteClick.bind(this)
      this.fileInput = React.createRef();
   }

   componentWillUnmount() {
      document.querySelector("#closeModal").click()
   }
   
   deleteClick() {
      this.props.deleteAccount()
   }

   componentDidMount() {
      this.props.getCurrentProfile()
   }

   deleteExperience(id) {
      this.props.deleteExperience(id)
   }

   deleteEducation(id) {
      this.props.deleteEducation(id)
   }

   render() {
      const {current, loading} = this.props.profile
      const {picture} = this.props.auth.user
      const hasProfile = !isEmpty(current)
      let dashContent;

      if(current === null || loading) {
         dashContent = <Spinner/>
      } else {
         dashContent = (
            <div id="dashContent">
               <p className="lead text-muted">Welcome {this.props.auth.user.name}</p>
               {hasProfile ? (
                  <ProfileLinks />
               ) : (
                  <div className="btn-group mb-4" role="group">
                     <Link to="/dashboard/new" className="btn btn-light">
                     <i className="fas fa-user-circle text-info mr-1"></i>Create Profile</Link>                           
                  </div>
               )}
               
               {!hasProfile && (<div id="diabledDash"></div>)}
               
               <div id="experienceDash">
                  <h4 className="mb-2">Experience Credentials</h4>
                  <table className="table">
                     <thead>
                        <tr>
                           <th>Company</th>
                           <th>Title</th>
                           <th>Years</th>
                           <th />
                        </tr>
                     </thead>
                     <tbody>
                        {(!isEmpty(current) && current.experience.length > 0) && current.experience.map((exp) => {
                           return (
                              <ExperienceRow 
                                 company={exp.company}
                                 title={exp.title}
                                 years={dateFormat(exp.from, "mmm dS, yyyy") +" - "+ ((exp.to && dateFormat(exp.to, "mmm dS, yyyy")) || "Current")}
                                 key={exp._id}
                                 expid={exp._id}
                                 deleteExperience={this.deleteExperience}
                                 loading={exp.loading}
                              />
                           )
                        })}
                     </tbody>
                  </table>
               </div>
               
               <div id="educationDash">
                  <h4 className="mb-2">Education Credentials</h4>
                  <table className="table">
                     <thead>
                        <tr>
                           <th>School</th>
                           <th>Degree</th>
                           <th>Years</th>
                           <th />
                        </tr>
                     </thead>
                     <tbody>
                     {(!isEmpty(current) && current.education.length > 0) && current.education.map((edu) => {
                           return (
                              <EducationRow 
                                 school={edu.school}
                                 degree={edu.degree}
                                 years={dateFormat(edu.from, "mmm dS, yyyy") +" - "+ ((edu.to && dateFormat(edu.to, "mmm dS, yyyy")) || "Current")}
                                 key={edu._id}
                                 eduid={edu._id}
                                 deleteEducation={this.deleteEducation}
                                 loading={edu.loading}
                              />
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )
      }

      return (
         <div className="dashboard">
            <div className="container">
               <div className="row">
                  <div className="col-md-12">
                  <div className="clearfix d-flex align-items-center">
                     <div className="float-left mr-auto">
                        <h1 className="display-4">Dashboard</h1>                        
                     </div>
                     <div className="float-right ml-auto">
                        <button  type="button" className="btn btn-light btn-sm rounded" data-toggle="modal" data-target="#imageUploadModal">
                           {(picture && !picture.url) && (
                              <FontAwesomeIcon icon="plus" className="text-info" style={{padding: '2px'}}/>
                           )}
                           <FontAwesomeIcon icon="file-image" className="text-info mr-1"/>
                           {(picture && picture.url) ? "Change Picture" : "Add Picture"}
                        </button>                        
                     </div>
                  </div>
                  {/* Upload Picture Modal */}
                  <UploadModal 
                     error={this.props.errors.nofile}
                     picture={picture}
                     uploadPicture={this.props.uploadPicture}
                     deletePicture={this.props.deletePicture}
                  />
                  {/* Render dashContent */}
                  {dashContent}
                  {/* Render delete account button */}
                  {!loading && (
                  <div id="deleteButton">
                     <button className="btn btn-danger" data-toggle="modal" data-target="#exampleModal">
                        Delete My Account
                     </button>
                     {/* Confirm Modal */}
                     <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                           <div className="modal-content" style={{zIndex: 2040}}>
                              <div className="modal-header">
                              <h5 className="modal-title text-center" id="exampleModalLabel">Are you sure?</h5>
                              <button type="button" id="closeModal" className="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">&times;</span>
                              </button>
                              </div>
                              <div className="modal-body">
                              This action can NOT be undone.
                              </div>
                              <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                              <button type="button" onClick={this.deleteClick} className="btn btn-danger">Delete Account</button>
                              </div>
                           </div>
                        </div>
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

Dashboard.propTypes = {
   auth: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   getCurrentProfile: PropTypes.func.isRequired,
   deleteExperience: PropTypes.func.isRequired,
   deleteEducation: PropTypes.func.isRequired,
   deleteAccount: PropTypes.func.isRequired,
   uploadPicture: PropTypes.func.isRequired,
   deletePicture: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   profile: state.profile,
   errors: state.errors,
})

const mapActionsToProps = {
   getCurrentProfile,
   deleteExperience,
   deleteEducation,
   deleteAccount,
   uploadPicture,
   deletePicture,
}

export default connect(mapStateToProps, mapActionsToProps)(Dashboard)
