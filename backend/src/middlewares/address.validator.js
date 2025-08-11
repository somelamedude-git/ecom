const { body } = require('express-validator');
const { SafebaseValidator } = require('../utils/ValidationUtility');


const addressValidator = [
  SafebaseValidator('address_line_one', 'This field cannot be empty', true),
  SafebaseValidator('address_line_two', '', true, true),
  SafebaseValidator('landmark', 'Please provide a landmark', true),
  SafebaseValidator('city', 'City is required', true),
  SafebaseValidator('state', 'State is required', true),
  SafebaseValidator('country', 'Country is required', true),

  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .isNumeric()
    .withMessage('Kindly enter only digits')
    .isLength({ min: 6, max: 6 })
    .withMessage('A pincode can only be of 6 digits')
];

module.exports = { addressValidator };
