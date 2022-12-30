import express, { json } from "express";
import { doWork } from "./controllers/puppeteerController.js";
import fetch from "node-fetch";

const app = express();

app.use(json());

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.json({ status: true, message: "Our node.js app works" });
});
app.post("/webhook/scrape_tlp", async (req, res) => {
  var columnValues = await doWork();
  var query = `mutation($boardId: Int!, $itemId: Int!, $columnValues: JSON!) {change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnValues) {id}}`;

  const variables = {
    boardId: req.body.payload.inboundFieldValues.boardId,
    itemId: req.body.payload.inboundFieldValues.itemId,
    columnValues: columnValues,
  };
  console.log("Column Values are as follows:");
  console.log(columnValues);

  fetch("https://api.monday.com/v2", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE3ODU2NDc0MCwidWlkIjozMTA2OTg2OSwiaWFkIjoiMjAyMi0wOS0wMVQwMjo0MTowOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NjY4MDQ4MSwicmduIjoidXNlMSJ9.FkUIo2LrNQwetRYQ-9njWVrZsMrVNklgjqj7eldy2-o",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  })
    .then((res) => res.json({ status: "okay" }))
    .then((res) => console.log(JSON.stringify(res, null, 2))); // req.body.payload.inboundFieldValues.boardId
});
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
