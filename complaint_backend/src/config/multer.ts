// src/config/multer.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "complaints", // Cloudinary folder
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: () => Date.now().toString(),
    } as {
        folder: string;
        allowed_formats: string[];
        public_id: () => string;
    },
});
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, and PNG formats are allowed"));
    }
};

const upload = multer({ storage,fileFilter});

export default upload;
