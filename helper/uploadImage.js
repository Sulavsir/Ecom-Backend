const multer = require('multer');

// Define the storage engine using Multer's disk storage.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/'); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename files with a timestamp prefix
  },
});

const upload = multer({ storage: storage });

module.exports = upload;