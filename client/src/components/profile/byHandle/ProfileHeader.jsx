import React from 'react'
import PropTypes from 'prop-types'


const ProfileHeader = ({
   name,
   company,
   location,
   status,
   profilePicture,
   social,
}) => (
   <div className="row">
      <div className="col-md-12">
      <div className="card card-body bg-info text-white mb-3">
         <div className="row">
            <div className="col-4 col-md-3 m-auto">
               <div className="square">
                  <img className="rounded-circle squareImg" alt="profilePic" src={profilePicture}/>
               </div>
            </div>
         </div>
         <div className="text-center">
            <h1 className="display-4 text-center">{name}</h1>
            <p className="lead text-center">{status}{company && (" at " + company)}</p>
            <p>{location && location}</p>
            <p>
            {social && social.youtube && (
               <a className="text-white p-2" href={social.youtube}>
                  <i className="fas fa-globe fa-2x"></i>
               </a>
            )}
            {social && social.twitter && (
               <a className="text-white p-2" href={social.twitter} target={"_blank"}>
                  <i className="fab fa-twitter fa-2x"></i>
               </a>
            )}
            {social && social.facebook && (
               <a className="text-white p-2" href={social.facebook}>
                  <i className="fab fa-facebook fa-2x"></i>
               </a>
            )}
            {social && social.linkedin && (
               <a className="text-white p-2" href={social.linkedin}>
                  <i className="fab fa-linkedin fa-2x"></i>
               </a>
            )}
            {social && social.instagram && (
               <a className="text-white p-2" href={social.instagram}>
                  <i className="fab fa-instagram fa-2x"></i>
               </a>
            )}
            </p>
         </div>
      </div>
      </div>
   </div>
)

ProfileHeader.propTypes = {
   name: PropTypes.string.isRequired,
   company: PropTypes.string,
   location: PropTypes.string,
   status: PropTypes.string.isRequired,
   profilePicture: PropTypes.string,
   social: PropTypes.object,
}

ProfileHeader.defaultProps = {
   company: "",
   location: "",
   name: "",
}

export default ProfileHeader
