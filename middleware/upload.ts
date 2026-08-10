import multer from "multer";
import path from "path";

// Configure where uploaded files are stored
const storage = multer.diskStorage({
  // Save uploaded files in the uploads folder
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, "uploads/");
  },

  // Create a unique filename for each uploaded file
  filename: (
    req,
    file,
    cb
  ) => {
    // Keep the original file extension
    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Create the Multer upload middleware
const upload = multer({
  storage,
});

export default upload;