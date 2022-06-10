import { Router } from 'express';
import { controller } from './controller.js';
import { check } from 'express-validator';
import tokenMiddleware from './tokenMiddleware.js';

export const router = new Router();

router.get('/users', tokenMiddleware, controller.getUsers);

router.post('/login', controller.login);

router.post('/register', [
  check('username', 'Имя пользователя не может быть пустым').trim().notEmpty(),
  check('password', 'Минимальная длина пароля - 6 символов').trim().isLength({ min: 6 })
], controller.register);
