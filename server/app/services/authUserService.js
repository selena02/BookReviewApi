import jwt from "jsonwebtoken";

// Extracts the user ID from a JWT token
export const authUserService = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extracts token from header

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "some_secret_key"
    );
    req.userId = decoded.id; // Attaches the user ID to the request object
    next();
  } catch (error) {
    console.error("Failed to decode JWT:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
