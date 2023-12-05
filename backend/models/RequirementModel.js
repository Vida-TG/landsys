const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  applicationName: {
    type: String,
    required: true,
  },
  requiredDocuments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RequiredDocument',
    },
  ],
});

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
