"use strict";

// models/Message.js
var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  mediaUrl: String,
  timestamp: {
    type: Date,
    "default": Date.now
  }
});
var Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
module.exports = Message;
//# sourceMappingURL=Message.dev.js.map
