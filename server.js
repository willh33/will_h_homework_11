// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================

app.get("/notes", function(req, res) {
  console.log("directory is", path.join(__dirname, "public/notes/html"));
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//Routes to interact with the API
app.get("/api/notes", function(req, res) {
  //Get the notes from db.json and return them
  getNotes( notes => {
    return res.json(notes);
  });
});

// Create New Note - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newNote = req.body;

  //Assign new note an id, save it to db.json
  getNotes( notes => {
    const id = uuidv4();
    newNote.id = id;
    notes.push(newNote);
    console.log("just pushed new note", notes);
    writeNotes(notes, (response) => res.json(response));
  });
});

// Create New Note - takes in JSON input
app.delete("/api/notes/:id", function(req, res) {
  const id = req.params.id;

  //Remove note with the id from the list and rewrite to db.json

});

// Basic route that sends the user first to the AJAX Page
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

const getNotes = (callback) => {
  fs.readFile(path.join(__dirname, "db/db.json"), 'UTF8', async (error, data) =>
    { 
      if(error)
      {
        console.log("error");
        console.error(error)
        callback([]);
      }
      else 
      {
        console.log("data", data);
        return callback(JSON.parse(data));
      }
    }
  );
}

/**
 * Write to the file then call the callback function
 * @param {*} callback 
 */
const writeNotes = (notes, callback) => {
  fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), (err) => 
      err ? callback(err) : callback('Success!')
  );
}