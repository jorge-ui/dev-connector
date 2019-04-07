import React from 'react'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'


const EducationItem = ({
   current,
   school,
   degree,
   fieldofstudy,
   from,
   to,
   description
}) => (
   <li className="list-group-item">
      {school && (<h4>{school}</h4>)}
      <p>{dateFormat(from, 'mmm, yyyy')} - {current ? "Current" : dateFormat(to, 'mmm, yyyy')}</p>
      {degree && (<p><strong>Degree: </strong>{degree}</p>)}
      {fieldofstudy && (<p><strong>Field Of Study: </strong>{fieldofstudy}</p>)}
      {description && (<p><strong>Description: </strong>{description}</p>)}
   </li>
)

EducationItem.propTypes = {
   current: PropTypes.bool.isRequired,
   school: PropTypes.string.isRequired,
   degree: PropTypes.string,
   fieldofstudy: PropTypes.string,
   from: PropTypes.string.isRequired,
   to: PropTypes.string,
   description: PropTypes.string,
}

export default EducationItem