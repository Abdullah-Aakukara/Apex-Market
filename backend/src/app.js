const express = require('express')
const authRouter = require('./routes/auth.routes')
const productRouter = require('./routes/products.routes')
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// route all requests to authRouter which starts from /auth
app.use('/auth', authRouter);
app.use('/products', productRouter);


module.exports = app