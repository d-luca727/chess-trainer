const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let database;

module.exports = class chessDAO {
  static async injectDB(conn) {
    if (database) {
      return;
    }
    try {
      database = await conn.db(process.env.NS).collection("prova");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in chessDAO: ${e}`
      );
    }
  }
};
