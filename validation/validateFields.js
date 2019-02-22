const isEmpty = require('./isEmpty')

module.exports = function validateFields(data, validationList) {
   // Initialize checklist of things to validate
   var checkList = [...new Set(Object.entries(validationList).reduce((arr, test) => {
      return arr.concat(test[1].list);
   }, []))]
   let errors = {};
   checkList.forEach((field) => {
      // Prepare field for evaluation
      if(isEmpty(data[field])) data[field] = "";
      // Check if field is on validateList
      if(checkList.find((item) => item === field)) {
         // Skip if field is optional and empty
         if(validationList.required.list.find((el) => el === field) === false && isEmpty(data[field])) return;                        
         //Check what validations does field needs
         Object.keys(validationList).some((test) => {            
            // Check if field needs current validation (test)
            if(validationList[test].list.find((el) => el === field)) {               
               // Check if validation fails
               if(validationList[test].method(data[field]) === false) {                  
                  // Log corresponding error and proceed to next field
                  errors[field] = validationList[test].logError(field);
                  return true;
               }
            }
         })
      }
   });

   return {
      errors: errors,
      isValid: isEmpty(errors)
   }
}