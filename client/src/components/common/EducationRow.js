import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


const EducationRow = ({
   school,
   degree,
   years,
   eduid,
   deleteEducation,
   loading,
}) => {
   return (
      <tr id={`tr-${eduid}`}>
         <td>{school}</td>
         <td>{degree}</td>
         <td>{years}</td>
         <td className="d-flex flex-row-reverse">
            <button eduid={eduid} id={eduid} onClick={deleteEducation.bind(this, eduid)} className="btn btn-danger">
               {loading ? (
                  <span className="spinner-border text-light" role="status" style={{width: '15px', height: '15px'}}>
                     <span className="sr-only">Loading...</span>
                  </span>
               ) : (
                  <FontAwesomeIcon icon="trash-alt"/>                                 
                  )}
            </button>
         </td>
      </tr>
   )
}

EducationRow.propTypes = {
   school: PropTypes.string.isRequired,
   degree: PropTypes.string.isRequired,
   years: PropTypes.string.isRequired,
   loading: PropTypes.bool,
}

EducationRow.defaultProps = {
   loading: false,
}

export default EducationRow