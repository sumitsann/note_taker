const express = require("express");

const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");

const app = express();

const notesList = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  res.json(notesList.slice(1));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

function createNewNote(body, notesArrayElements) {
  const newNote = body;
  if (!Array.isArray(notesArrayElements)) notesArrayElements = [];

  if (notesArrayElements.length === 0) notesArrayElements.push(0);

  body.id = notesArrayElements[0];
  notesArrayElements[0]++;

  notesArrayElements.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArrayElements, null, 2)
  );
  return newNote;
}

app.post("/api/notes", (req, res) => {
  const newNote = createNewNote(req.body, notesList);
  res.json(newNote);
});

function deleteNote(id, notesArrayElements) {
  for (let i = 0; i < notesArrayElements.length; i++) {
    let note = notesArrayElements[i];

    if (note.id == id) {
      notesArrayElements.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArrayElements, null, 2)
      );

      break;
    }
  }
}

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, notesList);
  res.json(true);
});

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
