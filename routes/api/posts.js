const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc Tests post route
// @access Public
router.get('/test',
  (req, res) => res.json({msg: "posts works"}));

  // @route GET api/posts/:post_id
  // @desc gets posts
  // @access Public
  router.post('/:post_id',
    (req, res) => {
        const errors = {};
        Post.findById(req.params.post_id)
          .then(post => res.json(post))
          .catch(err => res.status(404));
  });

  // @route GET api/posts/:post_id
  // @desc gets post by id
  // @access Public
  router.get('/',
    (req, res) => {
        const errors = {};
        Post.find()
          .sort({date: -1})
          .then(posts => res.json(posts))
          .catch(err => res.status(404));
  });


  // @route POST api/posts
  // @desc creates post
  // @access Private
  router.post('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {
      const {errors, isValid} = validatePostInput(req.body);

      //check validation
      if(!isValid){
        return res.status(400).json(errors);
      }
      const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        user: req.user.id
      });
      newPost.save().then(post => res.json(post));
    });

    // @route POST api/post/like
    // @desc adds a like
    // @access Private
    router.post('/like/:post_id', passport.authenticate('jwt', {session: false}),
      (req, res) => {
        Profile.findOne({ user: req.user.id }).then( profile => {
        Post.findById(req.params.post_id).then(post => {

          //if the user has liked this before
          if(post.likes.find(like => like.user.toString() === req.user.id )){
            return res.status(400).json({alreadyliked: 'user already liked this post'});
          }
          post.likes.push( {user: req.user.id });
          post.save().then( post => res.json(post));

        }).catch(err => res.status(404).json(err));
}).catch(err => res.status(404).json({notfound: 'usernotfound'}));
      });

      // @route POST api/post/dislike/:post_id
      // @desc increments likes
      // @access Private
      router.post('/dislike/:post_id', passport.authenticate('jwt', {session: false}),
        (req, res) => {
          Profile.findOne({ user: req.user.id }).then( profile => {
          Post.findById(req.params.post_id).then(post => {

            //if the user has liked this before
            const index = post.likes.findIndex(like => like.user.toString() === req.user.id )
            console.log(index);
            if(index!==-1){
               post.likes.splice(index, 1);
               post.save().then( post => res.json(post));
             }

          }).catch(err => res.status(404).json({ cantdislike: 'you cant dislike this'}));
  }).catch(err => res.status(404).json({notfound: 'usernotfound'}));
        });

        // @route POST api/post/comment
        // @desc adds comment to posts
        // @access Private
        router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}),
          (req, res) => {
            Profile.findOne({ user: req.user.id }).then( profile => {
            Post.findById(req.params.post_id).then(post => {


              post.comments.push( {user: req.user.id,
                 text: req.body.text,
                  name: req.body.name });

              post.save().then( post => res.json(post));

            }).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json({notfound: 'usernotfound'}));
          });

          // @route DELETE api/post/deletecomment/:post_id
          // @desc increments likes
          // @access Private
          router.delete('/removecomment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}),
            (req, res) => {
              Profile.findOne({ user: req.user.id }).then( profile => {
              Post.findById(req.params.post_id).then(post => {

                //if the user has liked this before
                const index = post.comments.findIndex(comment => comment.id === req.params.comment_id )
                console.log(index);
                if(index!==-1){
                   post.comments.splice(index, 1);
                   post.save().then( post => res.json(post));
                 }else{
                   res.status(404).json({commentdoesntexist: 'no comment found'});
                 }

              }).catch(err => res.status(404).json({ cantdislike: 'you cant dislike this'}));
      }).catch(err => res.status(404).json({notfound: 'usernotfound'}));
            });


    // @route DELETE api/post/:post_id
    // @desc delete a post
    // @access private
    router.delete('/:post_id',   passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Profile.findOne({user: req.user.id}).then( profile => {
        Post.findById(req.params.post_id).then(post => {

          if(req.user.id === post.user.toString()){
            Post.findOneAndRemove({_id: post.id})
              .then(() => {
                res.json({success: true})
              })
                .catch(err => res.status(404).json({success: false}));

          }else{
            res.status(401).json({notallowed: 'user doesnt have access'});
          }
        }).catch( err => res.status(404)
          .json({notfound: 'post not found'}));
          });

          });

module.exports = router;
