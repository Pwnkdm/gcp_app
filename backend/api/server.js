const express = require("express");
const { Storage } = require("@google-cloud/storage");
const fileUpload = require("express-fileupload");
const mysql = require("mysql2");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://gcp-app-weff.vercel.app",
    credentials: true,
  })
);

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize the Google Cloud Storage client
const storage = new Storage({
  credentials: serviceAccount,
});

const PORT = process.env.PORT || 8080;
const bucketName = "demo_bucket7";

app.use(fileUpload());

// Route to handle file upload
app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const file = req.files.file;
    const blob = storage.bucket(bucketName).file(file.name);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("finish", () => {
      res.status(200).send({ message: "Upload complete", fileName: file.name });
    });

    blobStream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).send({ message: "Upload failed", error: err.message });
    });

    blobStream.end(file.data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: err.message });
  }
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
});

// Route to get data from SQL DB
app.get("/metadata", (req, res) => {
  db.query("SELECT * FROM uploads", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Route to get images from bucket
app.get("/file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const file = storage.bucket(bucketName).file(filename);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    res.json({ url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
