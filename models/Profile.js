const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String,
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String]
  },
  bio: {
    type: String
  },
  github: {
    type: String
  },
  experience: [{
    title: {
      type: String
    },
    company: {
      type: String
    },
    description: {
      type: String
    },
    from:{
      type: Date
    },
    to:{
      type: Date
    },
    current: {
      default: false
    }
  }],
  education: [{
    degree: {
      type: String
    },
    school: {
      type: String
    },
    from:{
      type: Date
    },
    to:{
      type: Date
    }
  }],
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
