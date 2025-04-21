const { query } = require("./database");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

class User {
  static async createUser(username, email, password) {
    try {
      const timestamp = moment().format();
      const filePath = path.join(__dirname, "../config/img/blankpfp.png");
      const photoData = await this.getDefaultAvatar(filePath);
      const queryText =
        "INSERT INTO account (username, email, password, avatar, date) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const result = await query(queryText, [
        username,
        email,
        password,
        photoData,
        timestamp,
      ]);
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async findUserByEmail(email) {
    try {
      const queryText =
        "SELECT account_id, username, email, avatar, following_id FROM account WHERE email = $1";
      const result = await query(queryText, [email]);
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  static async findPasswordByEmail(email) {
    try {
      const queryText = "SELECT email, password FROM account WHERE email = $1";
      const result = await query(queryText, [email]);
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  static getDefaultAvatar = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}

module.exports = User;
