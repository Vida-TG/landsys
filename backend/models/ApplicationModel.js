const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationName: {
    type: String,
    required: true,
  },
  applicationHash: {
    type: String,
  },
  fee: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Requested', 'Pending', 'Approved', 'Rejected'],
    default: 'Requested',
  },
  comments: {
    type: String,
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
  ],
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
