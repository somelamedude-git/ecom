const { body } = require('express-validator');

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