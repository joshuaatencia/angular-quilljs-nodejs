const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const testFolder =
  "C:/Users/josue/Documents/AngularProjects/quill-test/src/assets/image";

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(
      null,
      "C:/Users/josue/Documents/AngularProjects/quill-test/src/assets/image"
    );
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});

const upload = multer({ storage: storage });



app.get("/imagenes", (req, res) => {
 

  fs.readdir(testFolder, (err, files) => {
    res.json({
      files
    })
  });
 
});

app.post("/file", upload.single("file"), (req, res, next) => {
  const file = req.file;
  console.log(file.filename);
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

app.post("/multipleFiles", upload.array("files"), (req, res, next) => {
  const files = req.files;
  console.log(files);
  if (!files) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({ sttus: "ok" });
});
