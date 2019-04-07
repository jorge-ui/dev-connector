import React from 'react'
import PropTypes from 'prop-types'
import EducationItem from './EducationItem'
import ExperienceItem from './ExperienceItem'
import isEmpty from '../../../validation/isEmpty'


const ProfileCreds = ({
   experience,
   education
}) => (
   <div className="row">
      {/* Experience List */}
      {!isEmpty(experience) &&(<div className="col-md-6">
      <h3 className="text-center text-info">Experience</h3>
         <ul className="list-group">
            {experience.map((item, index) => {
               return <ExperienceItem key={index} {...item}/>
            })}
         </ul>
      </div>)}

      {/* Education List */}
      {!isEmpty(education) && (<div className="col-md-6">
      <h3 className="text-center text-info">Education</h3>
         <ul className="list-group">
            {education.map((item, index) => {
               return <EducationItem key={index} {...item} />
            })}
         </ul>
      </div>)}
   </div>
)

ProfileCreds.propTypes = {
   experience: PropTypes.array,
   education: PropTypes.array,
}

export default ProfileCreds