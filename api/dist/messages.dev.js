"use strict";

// api/messages.js
var mongoose = require('mongoose');

var Message = require('../../models/Message');

module.exports = function _callee(req, res) {
  var messages;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.method === 'GET')) {
            _context.next = 14;
            break;
          }

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Message.find().sort({
            timestamp: 1
          }));

        case 4:
          messages = _context.sent;
          res.status(200).json(messages);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching messages:', _context.t0);
          res.status(500).json({
            error: 'Error fetching messages'
          });

        case 12:
          _context.next = 15;
          break;

        case 14:
          res.status(405).json({
            error: 'Method Not Allowed'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};
//# sourceMappingURL=messages.dev.js.map
