
class RoleRepository {
  constructor(dal) {
    this.dal = dal;
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT)`;
    return this.dal.run(sql);
  }


  create(name) {
    return this.dal.run(
      `INSERT INTO roles (name)
        VALUES (?)`,
      [name]);
  }

  getById(id) {
    return this.dal.get(
      `SELECT * FROM roles WHERE id = ?`,
      [id]);
  }

  getByName(name) {
    return this.dal.get(
      `SELECT * FROM roles WHERE name = ?`,
      [name]);
  }

  getAllFeature() {
    return this.dal.all(
      `SELECT * FROM roles`);
  }
}

module.exports = RoleRepository;