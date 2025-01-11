"use strict";

// api/send-message.js
var mongoose = require('mongoose');

var Message = require('../../models/Message'); // Assuming you put your model in a separate file


var Ably = require('ably');

var ably = new Ably.Realtime({
  key: process.env.ABLY_KEY
});
var channel = ably.channels.get('chat-channel');

module.exports = function _callee(req, res) {
  var _req$body, username, message, mediaUrl, newMessage;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.method === 'POST')) {
            _context.next = 18;
            break;
          }

          _req$body = req.body, username = _req$body.username, message = _req$body.message, mediaUrl = _req$body.mediaUrl;

          if (!(!username || !message && !mediaUrl)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Username and either message or media are required'
          }));

        case 4:
          newMessage = new Message({
            username: username,
            message: message,
            mediaUrl: mediaUrl
          });
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(newMessage.save());

        case 8:
          // Publish message to Ably
          channel.publish('new-message', {
            username: username,
            message: message,
            mediaUrl: mediaUrl,
            timestamp: newMessage.timestamp
          });
          res.status(200).send('Message sent');
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](5);
          console.error('Error saving message:', _context.t0);
          res.status(500).json({
            error: 'Error saving message'
          });

        case 16:
          _context.next = 19;
          break;

        case 18:
          res.status(405).json({
            error: 'Method Not Allowed'
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 12]]);
};
//# sourceMappingURL=send-message.dev.js.map
