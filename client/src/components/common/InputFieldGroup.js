import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {faTwitter, faFacebook, faLinkedin, faYoutube, faInstagram} from '@fortawesome/free-brands-svg-icons'


const InputFieldGroup = ({
   type,
   placeholder,
   name,
   value,
   onChange,
   error,
   small,
   social,
   id,
   rows,
   onKeyDown,
}) => {
   let idProp = {}
   if(id) {
      idProp.id = id
   }
   if(social) {
      return (
         <div className="input-group mb-3">
            <div className="input-group-prepend">
               <span className="input-group-text">
                  <Icon icon={getSocialIcon(social)}/>
               </span>
            </div>
               <input
                  type={type}
                  className={classnames('form-control form-control-lg', {
                     'is-invalid': error
                  })}
                  placeholder={placeholder}
                  name={name}
                  value={value}
                  onChange={onChange}
                  {...idProp}
               />
            </div>
      )
   } else {
      return (
         <div className="form-group">
            {type === "textarea" ? (
               <textarea
               className={classnames('form-control form-control-lg', {
                  'is-invalid': error
               })}
               placeholder={placeholder}
               name={name}
               value={value}
               onChange={onChange}
               rows={rows}
               onKeyDown={onKeyDown}
            ></textarea>
            ) : (
               <input
                  type={type}
                  className={classnames('form-control form-control-lg', {
                     'is-invalid': error
                  })}
                  placeholder={placeholder}
                  name={name}
                  value={value}
                  onChange={onChange}
                  {...idProp}
               />
            )}
            {error && (<div className='invalid-feedback'>{error}</div>)}
            {small && (<small className="form-text text-muted">{small}</small>)}
         </div>
      )
   }
}

InputFieldGroup.propTypes = {
   type: PropTypes.string,
   placeholder: PropTypes.string,
   name: PropTypes.string.isRequired,
   value: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired,
   error: PropTypes.string.isRequired,
   small: PropTypes.string,
   social: PropTypes.string,
   id: PropTypes.string,
}

InputFieldGroup.defaultProps = {
   type: "Text",
   small: "",
   social: "",
   error: "",
   value: "",
   placeholder: "",
   rows: 5
}

function getSocialIcon(social) {
   switch(social) {
      case 'twitter'   : return faTwitter
      case 'facebook'  : return faFacebook
      case 'linkedin'  : return faLinkedin
      case 'youtube'   : return faYoutube
      case 'instagram' : return faInstagram
      default          : break
   }
}

export default InputFieldGroup