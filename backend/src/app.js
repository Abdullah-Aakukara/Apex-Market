const express = require('express')
const authRouter = require('./routes/auth.routes')
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// route all requests to authRouter which starts from /auth
app.use('/auth', authRouter);



module.exports = app