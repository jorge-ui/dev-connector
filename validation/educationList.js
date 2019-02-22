var isEmpty = require('./isEmpty');
var validator = require('validator');

String.prototype.toCapitalize = function() {
   return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
   required: {
      list: ['school', 'degree', 'fieldofstudy', 'from'],
      method: function (field) {
         return !validator.isEmpty(field);
      },
      logError: function(field) {
         return field.toCapitalize() + " is required"
      }
      }
}

