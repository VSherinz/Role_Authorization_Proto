
class UserRepository {
  constructor(dal) {
    this.dal = dal;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
	  email TEXT)`;
    return this.dal.run(sql);
  }

  create(name, email) {
    return this.dal.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]);
  }

  getByEmail(email) {
    return this.dal.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]);
  }

  getAllUser() {
    return this.dal.all(
      `SELECT * FROM users`);
  }
}

module.exports = UserRepository;