import pool from '../config/db.js';

// Cari user berdasarkan email
export const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

// Cari user berdasarkan ID
export const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};

// Tambah user baru
export const insertUser = async ({ username, email, password, role = 'user' }) => {
  const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, avatar_url, created_at, updated_at
  `;
  const { rows } = await pool.query(query, [username, email, password, role]);
  return rows[0];
};

// Ambil semua user
export const listUsers = async () => {
  const { rows } = await pool.query(`
    SELECT id, username, email, role, avatar_url, created_at, updated_at
    FROM users
    ORDER BY id ASC
  `);
  return rows;
};

// Update data user berdasarkan ID
export const updateUserById = async (id, fields) => {
  const keys = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    keys.push(`${key} = $${idx++}`);
    values.push(value);
  }

  if (!keys.length) return await findById(id);

  const query = `
    UPDATE users
    SET ${keys.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING id, username, email, role, avatar_url, created_at, updated_at
  `;
  values.push(id);

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Hapus user
export const deleteUserById = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return true;
};
