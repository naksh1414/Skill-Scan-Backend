import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
// import { OAuth2Client } from "google-auth-library";
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const register = async (req, res) => {
  try {
    const { formData } = req.body;
    const { email, password, fullName } = formData;

    const alreadyAUser = await User.findOne({ email });
    if (alreadyAUser)
      return res.status(400).json({ message: "This email is already in use." });

    const user = new User({ email, password, fullName });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, userType: user.userType, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // console.log(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .json({
        message: "Logged in successfully",
        token,
        resumeData: user.resumeData,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// export const googleLogin = async (req, res) => {
//   const { credential } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { email_verified, name, email } = ticket.getPayload();

//     if (email_verified) {
//       const user = await User.findOne({ email });

//       if (user) {
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//           expiresIn: "12h",
//         });
//         res.cookie("token", token, { httpOnly: true }).json({
//           token,
//           action: "Login",
//           user: { _id: user._id, name: user.username, email: user.email },
//         });
//       } else {
//         let password = email + process.env.JWT_SECRET;

//         let newUser = new User({
//           username: name,
//           email,
//           password,
//           fullname: name,
//         });
//         newUser = await newUser.save();
//         const token = jwt.sign(
//           {
//             userId: newUser._id,
//             role: newUser.role,
//             profileImg: newUser.profileImg,
//           },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: "12h",
//           }
//         );
//         res.cookie("token", token, { httpOnly: true }).json({
//           token,
//           action: "Register",
//           user: {
//             _id: newUser._id,
//             name: newUser.username,
//             email: newUser.email,
//           },
//         });
//       }
//     } else {
//       return res.status(400).json({
//         error: "Google login failed. Try again.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
