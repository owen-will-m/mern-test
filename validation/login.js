const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
  let errors = {};

  //make sure that it's a string!
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';


  if(!Validator.isEmail(data.email)){
    errors.email = 'invalid email';
  }
  if(!Validator.isLength(data.password, {min: 4, max: 30})){
    errors.password = 'Password length must be >4 && <30';
  }
  if(Validator.isEmpty(data.email)){
    errors.email = 'email required';
  }
  if(Validator.isEmpty(data.password)){
    errors.password = 'password required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
