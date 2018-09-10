const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
  let errors = {};

  //make sure that it's a string!
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.to = !isEmpty(data.to) ? data.to : '';
  data.description = !isEmpty(data.description) ? data.description : '';



  if(Validator.isEmpty(data.title)){
    errors.title = 'title required';
  }
  if(Validator.isEmpty(data.company)){
    errors.company = 'company required';
  }
  if(Validator.isEmpty(data.from)){
    errors.from = 'from required';
  }
  if(Validator.isEmpty(data.to)){
    errors.to = 'to required';
  }
  if(Validator.isEmpty(data.description)){
    errors.description = 'description required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
