import JobSeeker from "../models/JobSeekerModel.js";
import Recruiter from "../models/RecruiterModel.js";

import {
  JOBSEEKER_VALID_ARRAY_ELEMENT_UPDATES,
  JOBSEEKER_VALID_PROFILE_UPDATES,
  RECRUITER_VALID_PROFILE_UPDATES,
} from "../utils/constant.js";
import { uploadImage } from "../utils/fileUploadCloudinary.js";
import { computeProfileScore } from "../utils/helper.js";

export const updateUserProfile = async (req, res) => {
  try {
    const detailsToUpdate = req.body;
    console.log(detailsToUpdate);
    const user = req.user;
    const VALID_PROFILE_UPDATES =
      user.role == "JobSeeker"
        ? JOBSEEKER_VALID_PROFILE_UPDATES
        : RECRUITER_VALID_PROFILE_UPDATES;
    const isUpdateAllowed = Object.keys(detailsToUpdate).every((detail) =>
      VALID_PROFILE_UPDATES.includes(detail)
    );

    if (!isUpdateAllowed)
      throw new Error("Some of the fields cannot be updated");

    let updatedUser;
    if (user.role == "JobSeeker") {
      const profileScore = computeProfileScore({
        ...user.toObject(),
        ...detailsToUpdate,
      });
      detailsToUpdate.profileScore = profileScore;
      updatedUser = await JobSeeker.findByIdAndUpdate(
        user._id,
        detailsToUpdate,
        {
          runValidators: true,
          returnDocument: "after",
        }
      ).select("-password");
    } else {
      updatedUser = await Recruiter.findByIdAndUpdate(
        user._id,
        detailsToUpdate,
        {
          runValidators: true,
          returnDocument: "after",
        }
      ).select("-password");
    }
    if (!updatedUser) {
      throw new Error("Some of the fields cannot be updated");
    }

    res.json({
      message: `${updatedUser.firstName}'s profile updated successfully`,
      status: "success",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const updateUserArrayElementDetails = async (req, res) => {
  try {
    let detailsToUpdate = req.body;
    console.log(detailsToUpdate);
    const user = req.user;

    if (Object.keys(detailsToUpdate).length != 1)
      throw new Error("invalid request");

    const field = Object.keys(detailsToUpdate)[0];
    let [element, index] = field.split(".");

    if (isNaN(index)) throw new Error("index is not a number");

    index = parseInt(index);

    const VALID_PROFILE_UPDATES =
      user.role == "JobSeeker"
        ? JOBSEEKER_VALID_ARRAY_ELEMENT_UPDATES
        : RECRUITER_VALID_PROFILE_UPDATES;
    if (!VALID_PROFILE_UPDATES.includes(element))
      throw new Error("Some of the fields cannot be updated");

    const originalLength = user[element].length;
    if (index > originalLength || index < 0) throw new Error("invalid index");

    if (!detailsToUpdate[field]) {
      console.log("hi");
      if (index == originalLength)
        throw new Error("element at this index does not exist");
      console.log(user[element][index]._id);
      detailsToUpdate = {
        $pull: {
          [element]: { _id: user[element][index]._id },
        },
      };
    }
    let updatedUser;
    if (user.role == "JobSeeker") {
      updatedUser = await JobSeeker.findByIdAndUpdate(
        user._id,
        detailsToUpdate,
        {
          runValidators: true,
          returnDocument: "after",
        }
      ).select("-password");

      const profileScore = computeProfileScore({
        ...updatedUser.toObject(),
      });

      updatedUser = await JobSeeker.findByIdAndUpdate(
        user._id,
        { profileScore },
        {
          runValidators: true,
          returnDocument: "after",
        }
      ).select("-password");
    } else {
      updatedUser = await Recruiter.findByIdAndUpdate(
        user._id,
        detailsToUpdate,
        {
          runValidators: true,
          returnDocument: "after",
        }
      ).select("-password");
    }
    if (!updatedUser) {
      throw new Error("Some of the fields cannot be updated");
    }

    res.json({
      message: `${updatedUser.firstName}'s profile updated successfully`,
      status: "success",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { user } = req;
    const { password, ...userWithoutPassword } = user.toObject();
    res.json({
      message: `${user.firstName}'s profile fetched successfully`,
      status: "success",
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const updateProfilePhoto = (req, res) => {
  try {
    const { file } = req.body;
    console.log(req.body);
    console.log(req.files);
    const result = uploadImage(req.files.file.data);
    if (result)
      res.json({
        message: `image uploaded successfully`,
        status: "success",
        data: result,
      });
    else
      res.json({
        message: "image not uploaded",
      });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};
