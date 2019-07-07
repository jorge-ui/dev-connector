import React from 'react'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {faUserCircle, faGraduationCap} from '@fortawesome/free-solid-svg-icons'
import {faBlackTie} from '@fortawesome/free-brands-svg-icons'

const ProfileLinks = () => (
   <div className="btn-group mb-4" role="group">

      <Link to="/dashboard/edit" className="btn btn-light">
         <Icon icon={faUserCircle} className="text-info mr-1"/> Edit Profile
      </Link>

      <Link to="/dashboard/add-experience" className="btn btn-light">
         <Icon icon={faBlackTie} className="text-info mr-1"/> Add Experience
      </Link>

      <Link to="/dashboard/add-education" className="btn btn-light">
         <Icon icon={faGraduationCap} className="text-info mr-1"/> Add Education
      </Link>
      
   </div>
)

export default ProfileLinks