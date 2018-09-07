const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');
//load profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route GET api/profile/test
// @desc Tests profile route
// @access Public

router.get('/test',
  (req, res) => res.json({msg: "profile works"}));

  // @route GET api/profile
  // @desc gets current users profile
  // @access private
router.get('/',
  passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const errors = {noprofile: 'sorry there is no profile'};
        Profile.findOne({user: req.user.id})
          .populate('user', ['name', 'avatar'])
          .then(profile => {
            if(!profile){
              errors.noprofile = 'no profile';
              return res.status(404).json(errors);
            }
            res.json(profile);
          }).catch( err => res.status(404).json(err));
});



// @route POST api/profile
// @desc create/edit user profile
// @access private

router.post('/',
  passport.authenticate('jwt', {session: false}),
    (req, res) => {

      const {errors, isValid} = validateProfileInput(req.body);

      if(!isValid){
        res.status(400).json(errors);
      }

      const profileFields= {};
      profileFields.user = req.user.id;
      if(req.body.handle) profileFields.handle = req.body.handle;
      if(req.body.company) profileFields.company = req.body.company;
      if(req.body.website) profileFields.website = req.body.website;
      if(req.body.location) profileFields.location = req.body.location;
      if(req.body.status) profileFields.status = req.body.status;

      //skills: split into an array (comes in as csv)
      if(typeof req.body.skills !== 'undefined'){
         profileFields.skills = req.body.skills.split(',');
       }

      if(req.body.bio) profileFields.bio = req.body.bio;
      if(req.body.github) profileFields.github = req.body.github;

      //social
      profileFields.social = {};
      if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

      Profile.findOne({user: req.user.id})
        .then(profile => {
          //update bc profile already exists
          if(profile){
          Profile.findOneAndUpdate({ user: req.user.id}, { $set: profileFields}
          , {new: true}).then(profile => res.json(profile));
        }else{
          //create new profile

          //check if handle exists
          Profile.findOne({handle: profileFields.handle})
            .then(profile => {
              if(profile){
                errors.handle = 'handle already exists in database';
                res.status(400).json(errors);
              }
              //save profile
              new Profile(profileFields).save()
                .then(profile => res.json(profile))
                  .catch(err => console.log(err));

            });

        }


        });
});
module.exports = router;
