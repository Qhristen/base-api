import cloudinary from "cloudinary";
import multer from "multer";
import config from "../../config/custom-environment-variables";
import AppError from "./appError";

cloudinary.v2.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.mimetype.split("/").reverse()[0]
    );
  },
});

const cloudinaryUpload = async (
  file: string,
  public_id: string,
  next: Function
) => {
  return await cloudinary.v2.uploader.upload(
    file,
    {
      folder: "wavesacademy/posts",
      resource_type: "auto",
      use_filename: true,
      public_id,
      allowed_formats: ["jpg", "png", "jif", "jpeg"],
    },
    (error, result) => {
      next(error, result);
    }
  );
};

const cloudinaryUploadRaw = async (
  file: string,
  public_id: string,
  next: Function
) => {
  return await cloudinary.v2.uploader.upload(
    file,
    {
      folder: "wavesacademy/scripts",
      resource_type: "raw",
      use_filename: true,
      // allowed_formats: ["zip", "tar", "rar"],
      public_id,
    },
    (error, result) => {
      next(error, result);
    }
  );
};

const cloudinaryUpdateUpload = async (
  file: string,
  public_id: string,
  next: Function
) => {
  return await cloudinary.v2.uploader.upload(
    file,
    {
      resource_type: "raw",
      use_filename: true,
      allowed_formats: ["zip", "tar", "rar", "js", "sol"],
      public_id,
      invalidate: true
    },
    (error, result) => {
      next(error, result);
    }
  );
};

const cloudinaryDestroyRaw = async (public_id: string, next: Function) => {
  return await cloudinary.v2.uploader.destroy(
    public_id,
    {
      resource_type: "raw",
    },
    (error, result) => {
      next(error, result);
    }
  );
};


const cloudinaryDestroyImage = async (public_id: string, next: Function) => {
  return await cloudinary.v2.uploader.destroy(
    public_id,
    {
      resource_type: "image",
    },
    (error, result) => {
      next(error, result);
    }
  );
};

const upload = multer({ storage: storage });

export {
  upload,
  cloudinaryUpload,
  cloudinaryUploadRaw,
  cloudinaryDestroyRaw,
  cloudinaryUpdateUpload,
  cloudinaryDestroyImage
};
