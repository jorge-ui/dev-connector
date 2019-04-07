import React from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({
   bio,
   name,
   skills,
}) => (
   <div className="row">
      <div className="col-md-12">
      <div className="card card-body bg-light mb-3">
         {bio && (<div id="bioSection">
            <h3 className="text-center text-info">{name}'s Bio</h3>
            <p className="lead">{bio}</p>
            <hr />
         </div>)}
         <h3 className="text-center text-info">Skill Set</h3>
         <div className="row">
            <div className="d-flex flex-wrap justify-content-center align-items-center">
               {skills.map((skill, index) => {
                  return (
                     <div key={index} className="p-3">
                        <i className="fa fa-check"></i>{skill}
                     </div>
                  )
               })}
            </div>
         </div>
      </div>
      </div>
   </div>
)

ProfileAbout.propTypes = {
   bio: PropTypes.string,
   name: PropTypes.string.isRequired,
   skills: PropTypes.array.isRequired,
}

ProfileAbout.defaultProps = {
   name: "",
   bio: "",
}


export default ProfileAbout