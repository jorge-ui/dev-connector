var validator = require('validator');
var isEmpty = require('./isEmpty');
var User = require('../models/User');

module.exports = function validateRegisterInput(data) {
   let errors = {};
   // Define schema obj to validate
   var dataKeys = Object.keys(User.schema.obj);
   dataKeys.forEach((key) => {
      if(isEmpty(data[key])) data[key] = "";
   })
   if(isEmpty(data.password2)) data.password2 = "";

   // name field:
      // can't be empty
      if(validator.isEmpty(data.name, {ignore_whitespace: true})) {
         errors.name = "Name field can't be empty";
      } else
      // must be between 2 and 30 characters
      if(!validator.isLength(data.name, {min: 2, max: 30})) {
         errors.name = 'Name must be between 2 and 30 characters';
      }

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
         errors.password = "Password can't be empty";
      } else
      // must be between 8 and 30 characters
      if(!validator.isLength(data.password, {min: 8, max: 30})) {
         errors.password = 'Password must be 8 to 30 characters long';
      }
         // confirm password field
         if(validator.isEmpty(data.password2, {ignore_whitespace: true})) {
            errors.password2 = "Confirm password";
         } else
         // validate confirm match
         if(!validator.equals(data.password, data.password2)) {
            errors.password2 = "Passwords do not match";
         }
   return {
      errors: errors,
      isValid: isEmpty(errors)
   }
}