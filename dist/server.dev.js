"use strict";

require('dotenv').config();

var express = require('express');

var mongoose = require('mongoose');

var multer = require('multer');

var path = require('path');

var Ably = require('ably');

var fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000; // MongoDB connection

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('MongoDB connected');
})["catch"](function (err) {
  return console.error('MongoDB connection error:', err);
});
var messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  mediaUrl: String,
  timestamp: {
    type: Date,
    "default": Date.now
  }
});
var Message = mongoose.model('Message', messageSchema); // Ably setup

var ably = new Ably.Realtime({
  key: process.env.ABLY_KEY
});
var channel = ably.channels.get('chat-channel'); // Middleware

app.use(express["static"]('public'));
app.use(express.json()); // File upload setup

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
}); // Ensure uploads folder exists

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
} // Route to send message


app.post('/send-message', function _callee(req, res) {
  var _req$body, username, message, mediaUrl, newMessage;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, message = _req$body.message, mediaUrl = _req$body.mediaUrl;

          if (!(!username || !message && !mediaUrl)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            error: 'Username and either message or media are required'
          }));

        case 3:
          newMessage = new Message({
            username: username,
            message: message,
            mediaUrl: mediaUrl
          });
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(newMessage.save());

        case 7:
          // Publish message to Ably
          channel.publish('new-message', {
            username: username,
            message: message,
            mediaUrl: mediaUrl,
            timestamp: newMessage.timestamp
          });
          res.status(200).send('Message sent');
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          console.error('Error saving message:', _context.t0);
          res.status(500).send({
            error: 'Error saving message'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
}); // File upload route

app.post('/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).send({
      error: 'No file uploaded'
    });
  }

  var mediaUrl = "/uploads/".concat(req.file.filename); // Fixed the string interpolation here

  res.json({
    mediaUrl: mediaUrl
  });
}); // Fetch all messages

app.get('/messages', function _callee2(req, res) {
  var messages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Message.find().sort({
            timestamp: 1
          }));

        case 3:
          messages = _context2.sent;
          res.json(messages);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching messages:', _context2.t0);
          res.status(500).send({
            error: 'Error fetching messages'
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Clear all messages

app["delete"]('/messages', function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Message.deleteMany({}));

        case 3:
          res.status(200).send('Chat cleared');
          _context3.next = 10;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.error('Error clearing chat:', _context3.t0);
          res.status(500).send({
            error: 'Error clearing chat'
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
}); // Serve static files (e.g., images, CSS, JS)

app.use('/uploads', express["static"](path.join(__dirname, 'uploads'))); // Start server

app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT)); // Fixed the console log
});
//# sourceMappingURL=server.dev.js.map
