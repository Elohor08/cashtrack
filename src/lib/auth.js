import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  } catch (err) {
    return null;
  }
}
