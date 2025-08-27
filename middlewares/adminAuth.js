import "dotenv/config";
import jwt, { decode } from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decode.userType === "user") {
      return res.status(401).json({ message: "Authorization denied" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
