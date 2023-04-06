const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoogleSchema = new Schema({
  googleId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Google = mongoose.model("Google", GoogleSchema);

module.exports = Google;
