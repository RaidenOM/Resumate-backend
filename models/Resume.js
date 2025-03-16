const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  url: {
    type: String,
  },
  previewUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Resume", ResumeSchema);
