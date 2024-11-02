const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;
// const isProduction = process.env.NODE_ENV === 'production';
const expressLayouts = require('express-ejs-layouts');
const { Stream } = require('stream');
const route = require('./app/routes');
const static_path = path.join(__dirname, "./routes")
app.use('/uploads', express.static('uploads'));
// app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(static_path));
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  express.static('uploads')(req, res, next);
});
app.use(helmet());
require('dotenv').config();


// app.use(morgan(isProduction ? morgan('combined', {stream: accessLogStream}): morgan('dev')));
// app.use(morgan('combined'))
app.use(morgan('tiny'))


app.use(cors({origin: "*"}));

app.use(express.json());

// app.use('/', (req, res)=>{
//     res.send("thinh dep trai")
// })
route(app); 
const db = require('./app/config/db/connect');

db.connect();
app.listen(port,()=>{
    console.log(`Server is running on port at  http://localhost:${port}`);
  })