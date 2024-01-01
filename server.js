const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/dist/uploads/') // Destination folder
  },
  filename: function(req, file, cb) {
    console.log(file.fieldname)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.use(cors());

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    // req.file is the 'file' file
    if (!req.file) {
      throw new Error('No file provided');
    }
    res.send('File uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

app.post('/api/upload-multiple', upload.array('file'), (req, res) => {
  try {
    // req.files is the array of your files
    if (!req.file) {
      throw new Error('No files provided');
    }
    res.send(`${req.file.length} files uploaded successfully!`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});