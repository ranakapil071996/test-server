const mongoose = require('mongoose');

const UserKyc = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    adhaar: { type: String, required: true },
    pan: { type: String, required: true },
    gender: { type: String, required: true },
    docUrl: { type: String, required: true },
    isApproved: { type: Boolean, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('userkyc', UserKyc);
