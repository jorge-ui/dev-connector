import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'


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
                  <Icon icon={faTrashAlt}/>                                 
                  )}
            </button>
         </td>
      </tr>
   );
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