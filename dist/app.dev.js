"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var username = '';
  var ably = new Ably.Realtime({
    key: 'A2d_-A.1BaGMw:stl13eplJUOlO1UI5slUxDy9S17jg6FaoM9CsWQJYUk'
  });
  var chatChannel = ably.channels.get('chat-channel'); // Function to display a message

  function displayMessage(_ref) {
    var username = _ref.username,
        message = _ref.message,
        mediaUrl = _ref.mediaUrl,
        timestamp = _ref.timestamp;
    var messageElement = document.createElement('div');
    messageElement.className = 'message';
    var time = new Date(timestamp).toLocaleTimeString();
    messageElement.innerHTML = "\n            <div class=\"msg-bubble ".concat(username === 'you' ? 'user-msg' : 'bot-msg', "\">\n                <strong>").concat(username, "</strong> <span>(").concat(time, ")</span><br>\n                ").concat(message || '', "\n                ").concat(mediaUrl ? "<br><img src=\"".concat(mediaUrl, "\" alt=\"Media\" style=\"max-width: 100%;\">") : '', "\n            </div>\n        ");
    document.getElementById('messages-container').appendChild(messageElement);
    document.getElementById('messages-container').scrollTop = document.getElementById('messages-container').scrollHeight;
  } // Fetch messages on load


  function fetchMessages() {
    var response, messages;
    return regeneratorRuntime.async(function fetchMessages$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(fetch('/api/messages'));

          case 3:
            response = _context.sent;
            _context.next = 6;
            return regeneratorRuntime.awrap(response.json());

          case 6:
            messages = _context.sent;
            messages.forEach(displayMessage);
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error('Error fetching messages:', _context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 10]]);
  } // Listen for new messages from Ably


  chatChannel.subscribe('new-message', function (message) {
    displayMessage(message.data);
  }); // Handle message sending

  document.getElementById('send-message-btn').addEventListener('click', function _callee() {
    var messageInput, fileInput, message, mediaUrl, formData, uploadResponse, _ref2, uploadedMediaUrl;

    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            messageInput = document.getElementById('user-message');
            fileInput = document.getElementById('file-input');
            message = messageInput.value.trim();

            if (username) {
              _context2.next = 6;
              break;
            }

            alert("Please enter a username before sending a message.");
            return _context2.abrupt("return");

          case 6:
            if (!(message || fileInput && fileInput.files.length > 0)) {
              _context2.next = 40;
              break;
            }

            mediaUrl = ''; // Handle file upload

            if (!(fileInput && fileInput.files.length > 0)) {
              _context2.next = 27;
              break;
            }

            formData = new FormData();
            formData.append('file', fileInput.files[0]);
            _context2.prev = 11;
            _context2.next = 14;
            return regeneratorRuntime.awrap(fetch('/api/upload', {
              method: 'POST',
              body: formData
            }));

          case 14:
            uploadResponse = _context2.sent;
            _context2.next = 17;
            return regeneratorRuntime.awrap(uploadResponse.json());

          case 17:
            _ref2 = _context2.sent;
            uploadedMediaUrl = _ref2.mediaUrl;
            mediaUrl = uploadedMediaUrl;
            _context2.next = 27;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](11);
            console.error('Error uploading file:', _context2.t0);
            alert('Failed to upload file.');
            return _context2.abrupt("return");

          case 27:
            _context2.prev = 27;
            _context2.next = 30;
            return regeneratorRuntime.awrap(fetch('/api/send-message', {
              // Updated to serverless API
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: username,
                message: message,
                mediaUrl: mediaUrl
              })
            }));

          case 30:
            _context2.next = 36;
            break;

          case 32:
            _context2.prev = 32;
            _context2.t1 = _context2["catch"](27);
            console.error('Error sending message:', _context2.t1);
            alert('Failed to send message.');

          case 36:
            messageInput.value = '';
            if (fileInput) fileInput.value = ''; // Clear the file input

            _context2.next = 41;
            break;

          case 40:
            alert("Message cannot be empty.");

          case 41:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[11, 22], [27, 32]]);
  }); // Set username

  document.getElementById('username-input').addEventListener('input', function (event) {
    username = event.target.value.trim() || 'you';
  }); // Clear chat

  document.getElementById('clear-chat-btn').addEventListener('click', function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(fetch('/api/messages', {
              method: 'DELETE'
            }));

          case 3:
            // Updated to serverless API
            document.getElementById('messages-container').innerHTML = '';
            _context3.next = 10;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            console.error('Error clearing chat:', _context3.t0);
            alert('Failed to clear chat.');

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 6]]);
  }); // Initial messages fetch

  fetchMessages();
});
//# sourceMappingURL=app.dev.js.map
