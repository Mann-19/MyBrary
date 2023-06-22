require('dotenv').config();
const express = require("express");
const app = express();

const indexRouter = require('./routes/index');

app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use(express.static('public'));

app.use('/', indexRouter);

const mongoose = require("mongoose");
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  
}

app.listen(process.env.PORT || 3000);