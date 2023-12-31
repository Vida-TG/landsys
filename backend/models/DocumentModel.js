const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  document: {
    type: String,
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
