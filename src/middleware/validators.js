// Validasi sederhana agar tidak perlu lib tambahan
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body || {};
  if (!username || username.length < 3) {
    return res.status(400).json({ message: 'Username minimal 3 karakter' });
  }
  if (!emailRegex.test(email || '')) {
    return res.status(400).json({ message: 'Email tidak valid' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter' });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!emailRegex.test(email || '')) {
    return res.status(400).json({ message: 'Email tidak valid' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password wajib diisi' });
  }
  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { username, email, password } = req.body || {};
  if (email !== undefined && !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email tidak valid' });
  }
  if (password !== undefined && password.length > 0 && password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter' });
  }
  if (username !== undefined && username.length > 0 && username.length < 3) {
    return res.status(400).json({ message: 'Username minimal 3 karakter' });
  }
  next();
};
