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

app.get("/api/tasks", (req, res) => {
  let results = tasks;
  console.log(req.query);

  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});
