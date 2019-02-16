var validator = require('validator');
var isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
   let errors = {};
   if(isEmpty(data.email)) data.email = "";
   if(isEmpty(data.password)) data.password = "";

   // email field: 
      // can't be empty
      if(validator.isEmpty(data.email, {ignore_whitespace: true})) {
         errors.email = 'Email field can\'t be empty';
      } else
      // must be a valid email
      if(!validator.isEmail(data.email)) {
         errors.email = 'Not a valid email';
      }

   // password field:
      // can't be empty
      if(validator.isEmpty(data.password, {ignore_whitespace: true})) {
         errors.password = "Password is required";
      }

   return {
      errors: errors,
      isValid: isEmpty(errors)
   }
}