const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads');
    fs.mkdir(dest, { recursive: true })
      .then(() => cb(null, dest))
      .catch((err) => cb(err, dest));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const uploadFiles = upload.array('file', 10);

const handleFileUploads = async (req, res) => {
  try {
    const uploadedFile = req.files[0];
    const url = path.join('uploads', uploadedFile.filename);

    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'File upload failed',
    });
  }
};

module.exports = {
  uploadFiles,
  handleFileUploads,
};
