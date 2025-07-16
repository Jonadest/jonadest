import jwt from 'jsonwebtoken';

/**
 * Extracts and verifies a JWT from cookies in an Express request.
 * @param {import('express').Request} req - Express request object
 * @returns {Object|null} Decoded JWT payload or null if invalid/missing
 */
export function getUserFromCookies(req) {
  const token = req.cookies?.jbc;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return decoded;
  } catch (err) {
    console.warn('Invalid JWT:', err.message);
    return null;
  }
}
