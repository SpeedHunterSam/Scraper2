const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new WebsitesSchema object
// This is similar to a Sequelize model
const WebsitesSchema = new Schema({
  // `name` must be of type String
  // `name` must be unique, the default mongoose error message is thrown if a duplicate value is given
  name: {
    type: String,
    unique: true
  },
  // `books` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Book model
  // This allows us to populate the Websites with any associated Books
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Websites = mongoose.model("Websites", WebsitesSchema);

// Export the Websites model
module.exports = Websites;
