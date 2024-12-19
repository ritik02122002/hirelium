import JobSeeker from "../models/JobSeekerModel.js";
import Recruiter from "../models/RecruiterModel.js";

import {
  JOBSEEKER_VALID_PROFILE_UPDATES,
  RECRUITER_VALID_PROFILE_UPDATES,
} from "../utils/constant.js";

export const updateUserProfile = async (req, res) => {
  try {
    const detailsToUpdate = req.body;
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
