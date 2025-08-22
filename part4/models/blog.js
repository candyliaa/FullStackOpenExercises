const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (document, returnedObjet) => {
    returnedObjet.id = returnedObjet._id.toString();
    delete returnedObject._id;
    delete returnedObjet.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
