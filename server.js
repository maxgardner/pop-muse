const express = require('express');
let router = express.Router();
const exphbs  = require('express-handlebars');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Our database models
const Article = require("./models/Article")(mongoose);
const Comment = require("./models/Comment")(mongoose);

// Set up app with static dir, to use handlebars and parse requests as JSON object
app.use(express.static(process.cwd() + "/public"));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up mongoDB database
mongoose.Promise = Promise;
mongoose.connect(require("./config/mongokey"));
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
app.use(require("./routes/getStuff")(router, Article, Comment));
app.use(require("./routes/addStuff")(router, Article, Comment));

app.listen(port);
