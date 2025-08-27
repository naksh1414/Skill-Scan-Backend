import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
export const getUserProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    // console.log(profileId);
    if (profileId) {
      const alreadyAUser = await User.findOne({
        _id: profileId,
      }).select("fullName email resumeData templates");
      if (!alreadyAUser)
        return res.status(400).json({ message: "user not exists" });

      // console.log(alreadyAUser);
      return res.status(201).json({
        userDetails: alreadyAUser,
        message: "User details found",
      });
    }
    return res.status(201).json({
      message: "Invalid Route",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResumeData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { resumeData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.resumeData = resumeData;
    if (!user.templates.includes(resumeData.template)) {
      user.templates.push(resumeData.template);
    }
    await user.save();

    return res.status(200).json({
      message: "Resume data updated successfully",
      resumeData: user.resumeData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export async function handleOTPSending(req, res) {
  try {
    const { email, OTP } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json("Invalid Credentials");
    }
    const token = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `Your OTP IS ${OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
        return res.json(error);
      } else {
        return res.json("Success");
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function handleForgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json("Invalid Credentials");
    }
    const token = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
        return res.json(error);
      } else {
        return res.json("Success");
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function handleResetPassword(req, res) {
  try {
    const { id, token, password } = req.body;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.json("Error with token");
      } else {
        const user = await User.findOne({ _id: id });
        if (user.password) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return res.json("Don't use same password :]");
          }
        }
        const salt = bcrypt.genSaltSync(11);
        const hash_password = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate({ _id: id }, { password: hash_password });
        return res.json("Successfully Changed the password");
      }
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
