import React from 'react'
import PropTypes from 'prop-types'


const EducationRow = ({
   school,
   degree,
   years,
   eduid,
   deleteEducation
}) => {
   return (
      <tr>
         <td>{school}</td>
         <td>{degree}</td>
         <td>{years}</td>
         <td className="d-flex flex-row-reverse">
            <button eduid={eduid} onClick={deleteEducation} className="btn btn-danger">
               Delete
            </button>
         </td>
      </tr>
   )
}

EducationRow.propTypes = {
   school: PropTypes.string.isRequired,
   degree: PropTypes.string.isRequired,
   years: PropTypes.string.isRequired
}

export default EducationRow