const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data){
  let errors = {};

  //make sure that it's a string!
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.to = !isEmpty(data.to) ? data.to : '';



  if(Validator.isEmpty(data.school)){
    errors.school = 'school required';
  }
  if(Validator.isEmpty(data.degree)){
    errors.degree = 'degree required';
  }
  if(Validator.isEmpty(data.from)){
    errors.from = 'from required';
  }
  if(Validator.isEmpty(data.to)){
    errors.to = 'to required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
