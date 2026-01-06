import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Use timestamp + fieldname for uniqueness
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for profile pictures"), false);
  }
};

// Limit size to 2MB
const uploadProfile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB max
});

export default uploadProfile;
