let express = require("express");
let mongodb = require("mongodb");
const dotenv = require('dotenv')
dotenv.config()

let app = express();
let db;

app.use(express.static("public"));

mongodb.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db();
    app.listen(3000);
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="form" action="add-item" method="post">
            <div class="d-flex align-items-center">
              <input id="input-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="list" class="list-group pb-5">
        </ul>
        
      </div>
      
      <script>
          let items = ${JSON.stringify(items)}
      </script>

      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="browser.js"></script>
    </body>
    </html>`);
    });
});

app.post("/add-item", function (req, res) {
  db.collection("items").insertOne({ text: req.body.text }, function (
    err,
    info
  ) {
    res.json(info.ops[0]);
  });
});

app.post("/update-item", function (req, res) {
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: req.body.item } },
    function () {
      //res.redirect('/JS-mongoDB')
      res.send("success");
    }
  );
});

app.post("/delete-item", function (req, res) {
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.send("success");
    }
  );
});
