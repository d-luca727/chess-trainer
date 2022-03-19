const app = require("./server.js");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const ChessDAO = require("./dao/chessDAO.js");

dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 5000;

MongoClient.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ChessDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
