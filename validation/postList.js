var isEmpty = require('./isEmpty');
var validator = require('validator');

String.prototype.toCapitalize = function() {
   return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
   required: {
      list: ['body'],
      method: function (field) {
         return !validator.isEmpty(field);
      },
      logError: function(field) {
         return field.toCapitalize() + " is required"
      }
   },
   isLength: {
      list: ['body'],
      range: {min: 10, max: 40},
      method: function (field, opts) {
         opts = this.range;
         return validator.isLength(field, opts)
      },
      logError: function(field) {
         let {min, max} = this.range;
         return field.toCapitalize() + " must be between "+min+" and "+max+" characters long"
      }
   }
}