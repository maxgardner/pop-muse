const express = require('express');
let router = express.Router();
const exphbs  = require('express-handlebars');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();

// Our database models
const Article = require("./models/Article")(mongoose);
const Comment = require("./models/Comment")(mongoose);
const Author = require("./models/Author")(mongoose);

// Set up app with static dir, to use handlebars and parse requests as JSON object
let hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});
app.use(express.static(process.cwd() + "/public"));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));

// Set up mongoDB database
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/popmuse");
// mongoose.connect(require("./config/mongodb").uri);
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Import routes
app.use(require("./routes/getData")(router, Article, Comment, Author));
app.use(require("./routes/changeData")(router, Article, Comment, Author));

app.listen(port);
