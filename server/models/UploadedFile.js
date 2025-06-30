const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UploadedFile', uploadedFileSchema);
