import { Router, Request, Response, NextFunction } from "express";
import {
  submitForm,
  getForms,
  getFormById,
} from "../controllers/formController";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadDir = "uploads/";
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

// Upload endpoint
router.post(
  "/upload",
  upload.array("images", 10),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadedUrls = files.map((file) => `/uploads/${file.filename}`);

      res.json({
        success: true,
        imageUrls: uploadedUrls, // Return array instead of single URL
        message: "Files uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }
  }
);

// Your existing routes
router.post("/submit", submitForm);
router.get("/forms", getForms);
router.get("/forms/:id", getFormById);

export default router;
