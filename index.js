require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const bcrypt = require("bcrypt");

const File = require("./models/File.model");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

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
  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }
  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);
  res.download(file.filePath, file.fileOriginalName);
}
app.route("/file/:id").get(handleDownload).post(handleDownload);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
