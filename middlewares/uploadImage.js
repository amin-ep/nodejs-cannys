import multer from 'multer';
import HTTPError from '../errors/httpError.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('images')) {
    cb(null, true);
  } else {
    cb(new HTTPError('Not an image, please upload only images', 400), false);
  }
};
const uploads = multer({ storage: storage, fileFilter: multerFilter });

export const uploadImage = uploads.single('images');
