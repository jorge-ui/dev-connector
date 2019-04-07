import React from 'react'
import PropTypes from 'prop-types'


const ExperienceRow = ({
   company,
   title,
   years,
   expid,
   deleteExperience
}) => {
   return (
      <tr>
         <td>{company}</td>
         <td>{title}</td>
         <td>{years}</td>
         <td className="d-flex flex-row-reverse">
            <button expid={expid} onClick={deleteExperience} className="btn btn-danger">
               Delete
            </button>
         </td>
      </tr>
   )
}

ExperienceRow.propTypes = {
   company: PropTypes.string.isRequired,
   title: PropTypes.string.isRequired,
   years: PropTypes.string.isRequired,
   expid: PropTypes.string.isRequired,
}

export default ExperienceRow