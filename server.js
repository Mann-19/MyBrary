require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

const mongoose = require("mongoose");
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DATABASE_URL);
}
const db = mongoose.connection;
db.once('open', () => console.log("Connected to MongoDB.."))

app.listen(process.env.PORT || 3000);