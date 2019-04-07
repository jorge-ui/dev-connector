import React from 'react'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'

const ExperienceItem = ({
   current,
   title,
   company,
   location,
   from,
   to,
   description
}) => (
   <li className="list-group-item">
      {company && (<h4>{company}</h4>)}
      <p>{dateFormat(from, 'mmm, yyyy')} - {current ? "Current" : dateFormat(to, 'mmm, yyyy')}</p>
      {title && (<p><strong>Position: </strong>{title}</p>)}
      {location && (<p><strong>Location: </strong>{location}</p>)}
      {description && (<p><strong>Description: </strong>{description}</p>)}
      
   </li>
)
ExperienceItem.propTypes = {
   current: PropTypes.bool.isRequired,
   title: PropTypes.string.isRequired,
   company: PropTypes.string.isRequired,
   location: PropTypes.string,
   from: PropTypes.string.isRequired,
   to: PropTypes.string,
   description: PropTypes.string,
}


export default ExperienceItem