import jwt from "jsonwebtoken";

// The secret key and expiration time should be stored as environment variables,
// here I provide an alternative just for demo, but it's not recommended for production
const JWT_SECRET = process.env.JWT_SECRET || "some_secret_key";
const JWT_EXPIRES_IN = "7d"; // Long expiration for easier testing

export function generateToken(user) {
  const payload = {
    id: user.id,
    roles: user.roles.map((role) => role.name), // Extracting the role names from the Role Entity
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
