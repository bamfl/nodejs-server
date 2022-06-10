import User from './models/User.cjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const secretKey = process.env.SECRET_KEY;

const generateAccessToken = (id, username) => {
  const payload = { id, username };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

class Controller {
  async register(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) return res.status(400).json({ message: 'Ошибка регистрации', ...errors });

      const { username, password } = req.body;
      const candidateExists = !!(await User.findOne({ username }));

      if (candidateExists) return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });

      const passwordHash = bcrypt.hashSync(password, 7);
      const user = new User({ username, password: passwordHash });

      await user.save();
      return res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: 'Ошибка регистрации' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) return res.status(400).json({ message: `Пользователя ${username} не существует` });

      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) return res.status(400).json({ message: `Неверный пароль` });

      const accessToken = generateAccessToken(user._id, user.password);
      return res.status(200).json({ message: `Успешный вход`, tokens: { accessToken } });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: 'Ошибка входа' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();

      let usersWithoutPassword = [];

      for (let user of users) {
        usersWithoutPassword.push({
          _id: user._id,
          username: user.username,
        });
      }

      res.json(usersWithoutPassword);
    } catch (e) {
      console.error(e);
    }
  }
}

export const controller = new Controller();
