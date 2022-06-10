import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

export default async function(req, res, next) {
  if (req.method === 'OPTIONS') next();

  try {
    let token = null;

    if (req.headers.authorization.includes('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(403).json({ message: `Пользователь не авторизован` });

    const decodedToken = jwt.verify(token, secretKey);

    req.user = decodedToken;
    next();
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: `Пользователь не авторизован` });
  }
}
