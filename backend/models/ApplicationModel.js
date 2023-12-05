const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
  },
  ownerFullName: {
    type: String,
  },
  ownerAddress: {
    type: String,
  },
  prevOwnerType: {
    type: String,
  },
  developed: {
    type: Boolean,
  },
  occupied: {
    type: Boolean,
  },
  residentType: {
    type: String,
  },
  sizeSqm: {
    type: Number,
  },
  location: {
    type: String,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
  },
  applicationHash: {
    type: String,
  },
  comments: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'ActionNeeded', 'Completed'],
    default: 'Pending',
  },
  recordLog: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransactionLog',
    },
  ],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
  ],
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
