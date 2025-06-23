const { body } = require('express-validator');

// To be used for every validator that has been made
const SafebaseValidator = (field, message, escape=false, optional=false)=>{
   let validator = body(field).trim();
   if(!optional){
    validator = validator.isEmpty().withMessage(message);
   }
   if(escape){
    validator = validator.escape();
   }

   return validator;
}

module.exports = { SafebaseValidator };