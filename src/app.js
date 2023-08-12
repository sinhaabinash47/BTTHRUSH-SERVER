const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

const port = 3001;

const posts = [];

app.get("/getBlogs", (req, res) => {
    const _posts = [];
    if (posts.length > 0) {
      posts.map((v) => {
        const __posts = {
          ...v,
          image: "/image/" + v.photo.filename, // Update the URL format here
        };
        _posts.push(__posts);
      });
    }
    res.json({ data: _posts });
  });
  

app.get("/getBlogs/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  res.json({ data: post });
});

app.post("/blogs", upload.single("photo"), (req, res) => {
  const id = posts.length;
  const request = {
    id,
    title: req.body.title,
    content: req.body.content,
    photo: req.file,
  };

  if (request.title.trim() === "" || request.content.trim() === "") {
    return res
      .status(400)
      .json({ message: "Title and content cannot be empty." });
  }
  posts.push(request);
  res.json(request);
});

app.get("/image", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "/uploads/1691774046489-vecteezy_whatsapp-logo-transparent-png_22101124_293.png"
    )
  );
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});