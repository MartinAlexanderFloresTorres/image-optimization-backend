import { Router } from "express";
import { getImages } from "../controllers/uploadsController.js";
import fileUpload from "express-fileupload";

const router = Router();

// URL
// ? http://localhost:4000/api/uploads

// File upload
router.post(
  "/",
  fileUpload({
    useTempFiles: false,
  }),
  getImages
);

export default router;
