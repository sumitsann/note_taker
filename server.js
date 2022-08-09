const express = require("express");
const app = express();
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

app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});
