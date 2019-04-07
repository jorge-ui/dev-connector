import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import UploadModal from './UploadModal'

class ProfileLinks extends Component {
   
   render() {
      const {picture} = this.props.auth.user
      const {errors, uploadPicture, deletePicture} = this.props
      return (
         <div className="btn-group mb-4" role="group">
            <Link to="/dashboard/edit" className="btn btn-light">
               <i className="fas fa-user-circle text-info mr-1"></i>
               Edit Profile</Link>
            <Link to="/dashboard/add-experience" className="btn btn-light">
               <i className="fab fa-black-tie text-info mr-1"></i>
               Add Experience</Link>
            <Link to="/dashboard/add-education" className="btn btn-light">
               <i className="fas fa-graduation-cap text-info mr-1"></i>
               Add Education</Link>
            <button  type="button" className="btn btn-light" data-toggle="modal" data-target="#imageUploadModal">
               <i className="fas fa-file-image text-info mr-1"></i>
               {(picture && picture.url) ? "Change Profile Picture" : "Add Profile Picture"}
            </button>
            {/* Upload Picture Modal */}
            <UploadModal 
               error={errors.nofile}
               picture={picture}
               uploadPicture={uploadPicture}
               deletePicture={deletePicture}
            />
         </div>
      )
   }
}

ProfileLinks.propTypes = {
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   uploadPicture: PropTypes.func.isRequired,
   deletePicture: PropTypes.func.isRequired,
}


export default ProfileLinks