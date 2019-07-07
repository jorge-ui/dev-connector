var isEmpty = require('./isEmpty');
var validator = require('validator');

String.prototype.toCapitalize = function() {
   return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
   required: {
      list: ['handle', 'status', 'skills'],
      method(field) {
         return !validator.isEmpty(field);
      },
      logError(field) {
         return field.toCapitalize() + " is required"
      }
      },
   isLength: {
      list: ['handle'],
      range: {min: 2, max: 40},
      method(field, opts) {
         opts = this.range;
         return validator.isLength(field, opts)
      },
      logError(field) {
         let {min, max} = this.range;
         return field.toCapitalize() + " must be between "+min+" and "+max+" characters long"
      }
   },
   isURL: {
      list: ['linkedin','instagram','website','youtube','twitter','facebook'],
      method (field) {
         if(isEmpty(field)) return true;
         else return validator.isURL(field);
      },
      logError(field) {
         return field.toCapitalize() + " link must be URL"
      }
   }
}