import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findByEmail, insertUser } from '../models/userModel.js';
dotenv.config();

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '2h',
  });

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const exists = await findByEmail(email);
    if (exists) return res.status(409).json({ message: 'Email sudah terdaftar' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await insertUser({ username, email, password: hashed, role });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
