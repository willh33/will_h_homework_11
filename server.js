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
  const newNote = req.body;

  //Get the notes, create an id for the new note, append new note, write notes to file
  getNotes( notes => {
    const id = uuidv4();
    newNote.id = id;
    notes.push(newNote);
    writeNotes(notes, (response) => res.json(newNote));
  });
});

// Create New Note - takes in JSON input
app.delete("/api/notes/:id", function(req, res) {
  const id = req.params.id;

  //Remove note with the id from the list and rewrite to db.json
  getNotes( notes => writeNotes(notes.filter(note => note.id !== id), (response) => res.json(response)));
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

/**
 * Retrieve notes from json file, parsing the string as json, returning empty array if there is an error
 * @param {*} callback: returns the result to the callback function when done
 */
const getNotes = (callback) => {
  fs.readFile(path.join(__dirname, "db/db.json"), 'UTF8', (error, data) => 
      error? callback([]) : callback(JSON.parse(data)));
}

/**
 * Write to the file then call the callback function
 * @param {*} callback: returns the result to the callback function when done
 */
const writeNotes = (notes, callback) => {
  fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes, null, '\t'), (err) => 
      err ? callback(err) : callback('Success!')
  );
}