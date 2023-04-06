const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacebookSchema = new Schema({
  facebookId: {
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
const Facebook = mongoose.model("Facebook", FacebookSchema);

module.exports = Facebook;
