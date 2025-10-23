import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import {
  listUsers,
  findById,
  updateUserById,
  deleteUserById,
} from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  const users = await listUsers();
  res.json(users);
};

export const getMe = async (req, res) => {
  const me = await findById(req.user.id);
  if (!me) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = me;
  res.json(safe);
};

// User hanya boleh mengedit profilnya sendiri (me)
export const updateMe = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    const updates = {};

    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (password !== undefined && password.length) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updated = await updateUserById(req.user.id, updates);
    const { password: _, ...safe } = updated;
    res.json({ message: 'Profile updated', user: safe });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Hapus akun sendiri
export const deleteMe = async (req, res) => {
  try {
    await deleteUserById(req.user.id);
    res.json({ message: 'Your account has been deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Upload avatar untuk diri sendiri
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();
    const updated = await updateUserById(req.user.id, { avatar_url: result.secure_url });
    const { password, ...safe } = updated;

    res.json({ message: 'Avatar uploaded', url: result.secure_url, user: safe });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

/**
 * Admin-only CRUD untuk user lain (opsional, biar lengkap CRUD)
 */
export const getUserByIdAdmin = async (req, res) => {
  const user = await findById(Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
};

export const updateUserByIdAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { username, email, password, role, avatar_url } = req.body || {};
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (password !== undefined && password.length) {
      updates.password = await bcrypt.hash(password, 10);
    }
    if (role !== undefined) updates.role = role;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const updated = await updateUserById(id, updates);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safe } = updated;
    res.json({ message: 'User updated', user: safe });
  } catch (err) {
    res.status(500).json({ message: 'Admin update failed', error: err.message });
  }
};

export const deleteUserByIdAdmin = async (req, res) => {
  try {
    await deleteUserById(Number(req.params.id));
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Admin delete failed', error: err.message });
  }
};
