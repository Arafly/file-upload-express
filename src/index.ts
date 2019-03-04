import * as express from "express";
import * as multer from "multer";
import * as cors from "cors";
import * as fs from "fs";
import * as path from "path";
import * as Loki from "lokijs";

import { loadCollection, imageFilter, cleanFolder } from "./utils";
import { DB_NAME, COLLLECTION_NAME, UPLOAD_PATH, upload, db } from "./config";

const app = express();
app.use(cors());

// clean all data before start
cleanFolder(UPLOAD_PATH);

// upload.single('avatar') is Multer middleware. It accept a single file with the field name avatar.
app.post("/profile", upload.single("avatar"), async (req, res) => {
  try {
    const col = await loadCollection(COLLLECTION_NAME, db);
    const data = col.insert(req.file);
    //   console.log(data);

    db.saveDatabase();
    res.send({
      id: data.$loki,
      fileName: data.filename,
      originalName: data.originalname
    });
  } catch (err) {
    res.sendStatus(400);
  }
});

// Upload multiple files, of file limit 10. accept an array of files as input and reply result as array.
app.post("/photos/upload", upload.array("photos", 10), async (req, res) => {
  try {
    const col = await loadCollection(COLLLECTION_NAME, db);
      const data = [].concat(col.insert(req.files));
      console.log(data);

    db.saveDatabase();
    res.send(
      data.map(x => ({
        id: x.$loki,
        fileName: x.filename,
        originalName: x.originalname
      }))
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

// Retrieve all images
app.get("/images", async (req, res) => {
  try {
    const col = await loadCollection(COLLLECTION_NAME, db);
    res.send(col.data);
  } catch (err) {
    res.sendStatus(400);
  }
});

// Retrieve image by Id
app.get("/images/:id", async (req, res) => {
  try {
    const col = await loadCollection(COLLLECTION_NAME, db);
    const result = col.get(req.params.id);

    if (!result) {
      res.sendStatus(404);
      return;
    }
    res.setHeader("Content-Type", result.mimetype);
    fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
  } catch (err) {
    res.sendStatus(400);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`Watch out on Port ${port}`);
});
