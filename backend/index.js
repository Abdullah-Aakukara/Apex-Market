const app = require('./src/app.js')
const db = require('./src/db/dbConfig.js');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const PORT = process.env.PORT

async function start() {
  try {
    await db.authenticate();
    console.log('Database connected successfully.');

    await db.sync();

    app.listen(PORT, () => {
      console.log("Server got started on PORT: ", PORT)
    })

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

start();