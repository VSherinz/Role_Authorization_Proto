
class UserRoleRepository {
  constructor(dal) {
    this.dal = dal;
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS userroles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
		isEnabled INTEGER,
		roleId INTEGER,
        userId INTEGER,
        CONSTRAINT userroles_fk_userId FOREIGN KEY (userId)
          REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT userroles_fk_roleId FOREIGN KEY (roleId)
          REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE)`;
    return this.dal.run(sql);
  }

  create(isEnabled, roleId, userId) {
    return this.dal.run(
      'INSERT INTO userroles (isEnabled, roleId, userId) VALUES (?, ?, ?)',
      [isEnabled, roleId, userId]);
  }

  update(userRole) {
    const { id, isEnabled } = userRole
    return this.dal.run(
      `UPDATE userroles SET isEnabled = ? WHERE id = ?`,
      [isEnabled, id]
    );
  }

  getIsEnableByUserRoleId(roleId, userId) {
    return this.dal.get(
      `SELECT isEnabled FROM userroles WHERE roleId = ? AND userId = ?`,
      [roleId, userId]);
  }

  switchIsEnable(roleId, userId, isEnabled) {
    return this.dal.get(
      `update userroles set isEnabled = ? WHERE roleId = ? AND userId = ?`,
      [isEnabled, roleId, userId]);
  }

  getAllUserRole() {
    return this.dal.all(
      `SELECT * FROM userroles`);
  }
}

module.exports = UserRoleRepository;