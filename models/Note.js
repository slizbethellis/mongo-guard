var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String,
  commentDate: {
    type: Date,
    default: Date.now
  }
});

var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;