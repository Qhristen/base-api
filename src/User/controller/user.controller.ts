import { NextFunction, Request, Response } from "express";
import {
  findOneUser,
  findUser,
  findUserByEmail,
} from "../services/user.service";
import AppError from "../../Utils/appError";
import {
  cloudinaryDestroyImage,
  cloudinaryUpload,
} from "../../Utils/cloudinary";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = req.session.user

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({ email });

    if (!user) {
      return next(new AppError(404, "User with that email not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const UpdateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, email } = req.body;
    const user = await findUserByEmail({ email });

    if (!user) {
      return next(new AppError(404, `${email} not found`));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Role update successfull",
    });
  } catch (err: any) {
    next(err);
  }
};

export const UpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, full_name } = req.body;
    const user = await findOneUser(req.session.user?.id);

    if (!user) {
      return next(new AppError(404, `User not found`));
    }
    let imagePath: any;

    if (req.file !== undefined) {
      if (user.avatar !== null) {
        await cloudinaryDestroyImage(
          user.avatar.public_id,
          (error: any, result: any) => {
            if (error) {
              return next(new AppError(error.http_code, error));
            }
            return result;
          }
        );
      }

      await cloudinaryUpload(
        String(req.file?.path),
        req.file.originalname,
        (error: any, result: any) => {
          if (error) {
            return next(new AppError(error.http_code, error));
          }
          imagePath = {
            url: result.secure_url,
            public_id: result.public_id,
          };
          return imagePath;
        }
      );
    }

    const userDetails: any = {
      email,
      full_name,
      avatar: imagePath,
    };

    Object.assign(user, userDetails);

    const newUpdate = await user.save();
    const updatedUser = await findOneUser(newUpdate.id);

    res.status(200).json({
      status: "success",
      message: "Profile updated",
      data: {
        user: updatedUser,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
