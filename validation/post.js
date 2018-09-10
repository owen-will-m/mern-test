const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data){
  let errors = {};

  //make sure that it's a string!
  data.text = !isEmpty(data.text) ? data.text : '';

  if(Validator.isEmpty(data.text)){
    errors.textEmpty = 'text required';
  }
  if(!Validator.isLength(data.text, {min: 1, max: 400})){
    errors.textLength = 'text must be 1 character'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
