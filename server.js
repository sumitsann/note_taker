const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const PORT = process.env.PORT || 3001;

const { tasks } = require("./Develop/db/db.json");

function filterByQuery(query, tasksArray) {
  let filteredResults = tasksArray;
  if (query.title) {
    filteredResults = filteredResults.filter(
      (task) => task.title === query.title
    );
  }
  if (query.text) {
    filteredResults = filteredResults.filter(
      (task) => task.text === query.text
    );
  }

  return filteredResults;
}

function findById(id, tasksArray) {
  const result = tasksArray.filter((task) => task.id === id)[0];
  return result;
}

function createNewTask(body, tasksArray) {
  console.log(body);
  // our function's main code will go here!

  const task = body;
  tasksArray.push(task);

  fs.writeFileSync(
    path.join(__dirname, "./Develop/db/db.json"),
    JSON.stringify({ tasks: tasksArray }, null, 2)
  );

  // return finished code to post route for response
  return task;
}
function validateTask(task) {
  if (!task.title || typeof task.title !== "string") {
    return false;
  }
  if (!task.text || typeof task.text !== "string") {
    return false;
  }

  return true;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/tasks", (req, res) => {
  let results = tasks;
  console.log(req.query);

  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/tasks/:id", (req, res) => {
  const result = findById(req.params.id, tasks);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post("/api/tasks", (req, res) => {
  req.body.id = tasks.length.toString();
  console.log(req.body);
  if (!validateTask(req.body)) {
    res.status(400).send("The task is not properly formatted.");
  } else {
    const task = createNewTask(req.body, tasks);
    res.json(task);
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  let savedTasks = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf-8"));
  taskId = req.params.id;
  let newID = 0;

  console.log("Deleting task with the ID: " + taskId);

  savedTasks = savedTasks.filter((currentTask) => {
    return currentTask.id != taskId;
  });
  for (currentTask of savedTasks) {
    currentTask.id = newID.toString();
    newID++;
  }

  fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedTasks));
  res.json(savedTasks);
});

app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});
