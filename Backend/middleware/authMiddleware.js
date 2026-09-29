import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required"
      });
    }

    const token = authHeader.split(" ")[1];

    // console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (error) {
    console.error(error);

    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};