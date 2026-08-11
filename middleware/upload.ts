import multer from "multer";

// Keep uploaded documents in memory before sending them to Cloudinary
const storage = multer.memoryStorage();

// Create the Multer upload middleware
const upload = multer({
  storage,
  limits: {
    // Limit uploaded documents to 10 MB
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;