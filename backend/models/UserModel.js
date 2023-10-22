const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
