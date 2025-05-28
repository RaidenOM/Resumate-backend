const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  previewUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Template", TemplateSchema);
