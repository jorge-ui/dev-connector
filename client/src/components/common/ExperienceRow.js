import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


const ExperienceRow = ({
   company,
   title,
   years,
   expid,
   deleteExperience,
   loading,
}) => {
   return (
      <tr id={`tr-${expid}`}>
         <td>{company}</td>
         <td>{title}</td>
         <td>{years}</td>
         <td className="d-flex flex-row-reverse">
            <button expid={expid} id={expid} onClick={deleteExperience.bind(this, expid)} className="btn btn-danger">
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

ExperienceRow.propTypes = {
   company: PropTypes.string.isRequired,
   title: PropTypes.string.isRequired,
   years: PropTypes.string.isRequired,
   expid: PropTypes.string.isRequired,
   loading: PropTypes.bool,
}

ExperienceRow.defaultProps = {
   loading: false,
}

export default ExperienceRow