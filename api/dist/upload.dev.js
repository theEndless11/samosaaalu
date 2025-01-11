"use strict";

// api/upload.js
var multer = require('multer');

var path = require('path'); // Multer setup for file uploads


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
});

module.exports = function (req, res) {
  upload.single('file')(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        error: 'File upload failed'
      });
    }

    var mediaUrl = "/uploads/".concat(req.file.filename); // Adjust based on your file storage configuration

    res.status(200).json({
      mediaUrl: mediaUrl
    });
  });
};
//# sourceMappingURL=upload.dev.js.map
