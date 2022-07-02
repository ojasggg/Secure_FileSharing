require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const bcrypt = require("bcrypt");

const File = require("./models/File.model");

const PORT = process.env.PORT || 3000;
const app = express();

const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.MONGODB_URI);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    filePath: req.file.path,
    fileOriginalName: req.file.originalname,
  };

  if (req.body.password != null && req.body.password != "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }
  const file = await File.create(fileData);
  console.log(file);
  res.send(file.fileOriginalName);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
