const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
  let errors = {};

  //make sure that it's a string!
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';


  if(!Validator.isLength(data.handle, {min: 4, max: 30})){
    errors.handle = 'handle length must be >4 && <30';
  }
  if(Validator.isEmpty(data.status)){
    errors.status = 'status required';
  }
  if(Validator.isEmpty(data.skills)){
    errors.skills = 'skills required';
  }
  if(!isEmpty(data.website)){
    if(!Validator.isURL(data.website)){
      errors.website = 'website not valid url';
    }
  }
  if(!isEmpty(data.facebook)){
    if(!Validator.isURL(data.facebook)){
      errors.facebook = 'facebook not valid url';
    }
  }if(!isEmpty(data.instagram)){
    if(!Validator.isURL(data.instagram)){
      errors.instagram = 'insta not valid url';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
