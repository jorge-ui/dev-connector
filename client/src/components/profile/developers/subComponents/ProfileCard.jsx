import React from 'react'
import PropTypes from 'prop-types'
import profileDefault from '../../../common/profileDefault.png'
import {Link} from 'react-router-dom'

const skillsDisplayLimit = 4


const ProfileCard = ({
   skills,
   user,
   status,
   location,
   profilePicture,
   handle
}) => (
   <div className="card card-body bg-light mb-3">
      <div className="row">
      <div className="col-2">
         <Link to={`/developers/${user.handle}`}>
            <div className="square">
               <img
                  className="rounded-circle squareImg"
                  src={(user.picture && user.picture.url) || profilePicture}
                  alt="profilePic"
               />
            </div>
         </Link>
      </div>
      <div className="col-lg-6 col-md-4 col-8">
         <h3>{user && (user.name)}</h3>
         <p>{status}</p>
         <p>{location}</p>
         <Link to={"/developers/" + handle} className="btn btn-info">View Profile</Link>
      </div>
      <div className="col-md-4 d-none d-lg-block">
         <h4>Skill Set</h4>
         <ul className="list-group">
            {skills.slice(0,skillsDisplayLimit).map((skill, index) => {
               return (
                  <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1"></i>{skill}</li>
               )
            })}
            
         </ul>
      </div>
      </div>
   </div>
)

ProfileCard.propTypes = {
   skills: PropTypes.array.isRequired,
   user: PropTypes.object.isRequired,
   status: PropTypes.string.isRequired,
   location: PropTypes.string.isRequired,
   profilePicture: PropTypes.string.isRequired,
   handle: PropTypes.string.isRequired,
}

ProfileCard.defaultProps = {
   skills: ["*skill#1", "*skill#2", "*skill#3", "*skill#4", "*skill#5"],
   user: {name: ""},
   status: "",
   location: "",
   profilePicture: profileDefault,
}

export default ProfileCard