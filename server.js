const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const path = require("path");

const PORT = process.env.PORT || 3000;

// Require all models
const db = require("./models");

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder ---- USE for static HTML PAGES ONLY
//app.use(express.static("public"));

//activate handlebars for page generation
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB either on Heroku or local

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Scraper";

mongoose.connect(MONGODB_URI,  { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useCreateIndex", true);


// When the server starts, create and save a new Websites document to the db
// The "unique" rule in the Websites model's schema will prevent duplicate collections from being added to the server
db.Websites.create({ name: "User Inputted Websites" })
  .then(function(dbWebsites) {
    // If saved successfully, print the new Websites document to the console
    console.log(dbWebsites);
  })
  .catch(function(err) {
    // If an error occurs, print it to the console
    console.log(err.message);
  });



// Routes

app.get("/", function(req, res) {

    
  
      res.render("index");
     

});


app.post("/submit", function(req, res) {
  db.Article.create(req.body)
    .then(function(dbArticle) {
      return db.Websites.findOneAndUpdate({}, { $push: { articles: dbArticle._id } }, { new: true });
    })
    .then(function(dbWebsites) {
      // If the Websites was updated successfully, send it back to the client
      res.json(dbWebsites);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      //res.json(dbArticle);

      console.log(dbArticle);

      const hbsObject = {
        article: dbArticle
    }
    console.log(hbsObject);
    res.render("articles", hbsObject);
   

    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/Websites", function(req, res) {
  db.Websites.find({})
    .then(function(dbWebsites) {
      res.json(dbWebsites);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to see what Websites looks like WITH populating
app.get("/populated", function(req, res) {
  // Using our Websites model, "find" every Websites in our db and populate them with any associated books
  db.Websites.find({})
    .populate("articles")
    .then(function(dbWebsites) {
      res.json(dbWebsites);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
