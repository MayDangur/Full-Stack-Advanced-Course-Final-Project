import multer from "multer";

// Keep profile images in memory before uploading them to Cloudinary
const storage = multer.memoryStorage();

const profileUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (
    req,
    file,
    cb
  ) => {
    // Accept image files only
    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }
  },
});

export default profileUpload;