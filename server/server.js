const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
let db;
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const bcrypt = require("bcrypt");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const API_URL = process.env.API_URL || "http://localhost:5005";

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(
  cors({
    origin: "https://portfolio-project-virid-rho.vercel.app",
    credentials: true,
  }),
);
// ================= SESSION =================
app.set("trust proxy", 1);
const isProd = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "someSuperSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: isProd, // فقط در حالت پروداکشن (Render) ترو باشه
      sameSite: isProd ? "none" : "lax", // در لوکال lax باشه
    },
  }),
);

// ================= STATIC FILES =================
// (Removed: No longer serving /uploads, all uploads are now on Cloudinary)

// ================= MULTER (UPLOAD CONFIGS) =================
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio/images",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio/files",
    resource_type: "raw", // Required for non-image files like PDF
  },
});

const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio/audio",
    resource_type: "video", // MUST be video for audio in Cloudinary
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadFile = multer({ storage: fileStorage });
const uploadAudio = multer({ storage: audioStorage });

// ================= MONGODB =================
MongoClient.connect(process.env.MONGO_URI)
  .then((client) => {
    console.log("✅ Mongo connected");
    db = client.db();
  })
  .catch((err) => console.log(err));

// ================= AUTH MIDDLEWARE =================
const checkAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Please login first" });
  }
};

// ================= ROUTES =================

// 🔐 LOGIN (Mongo + Session)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
    };

    res.json({ success: true, user: req.session.user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// 🔓 LOGOUT
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Could not logout" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// 🛡 CHECK AUTH STATUS
app.get("/api/check-auth", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// 📥 GET ALL PROJECTS
app.get("/api/projects", async (req, res) => {
  const projects = await db
    .collection("projects")
    .find()
    .sort({ displayOrder: 1, _id: -1 })
    .toArray();
  res.json(projects);
});

// 🔍 GET SINGLE PROJECT
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➕ CREATE PROJECT (Protected)
app.post(
  "/api/projects",
  checkAuth,
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  async (req, res) => {
    // Session auth is handled by checkAuth middleware
    console.log("FILES IN PROJECT POST:", req.files);
    console.log("BODY IN PROJECT POST:", req.body);

    // Handle Gallery Images
    let galleryPaths = [];
    if (req.files && req.files["gallery"]) {
      galleryPaths = req.files["gallery"].map((file) => file.path);
    }

    // Handle Cover Image
    let coverPath = "";
    if (req.files && req.files["image"]) {
      coverPath = req.files["image"][0].path;
    } else if (galleryPaths.length > 0) {
      coverPath = galleryPaths[0];
    }

    // Combine images: Cover is always the first one (without duplicate entries)
    const allImages = [...galleryPaths];
    if (coverPath && allImages[0] !== coverPath) {
      allImages.unshift(coverPath);
    }

    const newProject = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      keyFeatures: JSON.parse(req.body.keyFeatures || "[]"),
      techStack: JSON.parse(req.body.techStack || "[]"),
      image: allImages.length > 0 ? allImages[0] : "",
      images: allImages,
    };
    const result = await db.collection("projects").insertOne(newProject);
    res.json({ ...newProject, _id: result.insertedId });
  },
);

// ❌ DELETE PROJECT (Protected)
app.delete("/api/projects/:id", checkAuth, async (req, res) => {
  await db
    .collection("projects")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "Deleted" });
});

// 🔀 REORDER PROJECTS (Protected)
app.put("/api/projects/order", checkAuth, async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "orderedIds is required" });
    }

    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { displayOrder: index } },
      },
    }));

    await db.collection("projects").bulkWrite(operations);
    res.json({ success: true, message: "Project order updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✏️ UPDATE PROJECT (Protected)
app.put(
  "/api/projects/:id",
  checkAuth,
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const project = await db
        .collection("projects")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }

      const parseJsonArray = (value) => {
        if (!value) return [];
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      };

      const updateData = {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        keyFeatures: parseJsonArray(req.body.keyFeatures),
        techStack: parseJsonArray(req.body.techStack),
      };

      const currentImages = req.body.existingImages
        ? parseJsonArray(req.body.existingImages)
        : Array.isArray(project.images)
          ? project.images
          : [];

      let newGalleryPaths = [];

      if (req.files && req.files["gallery"]) {
        newGalleryPaths = req.files["gallery"].map((file) => file.path);
      }

      let finalImages = [...currentImages, ...newGalleryPaths];

      if (req.files && req.files["image"]) {
        const newCoverPath = req.files["image"][0].path;
        finalImages = [
          newCoverPath,
          ...finalImages.filter((img) => img !== newCoverPath),
        ];
      }

      updateData.images = finalImages;
      updateData.image = finalImages.length > 0 ? finalImages[0] : "";

      const updated = await db
        .collection("projects")
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData },
          { returnDocument: "after" },
        );

      return res.json(updated);
    } catch (error) {
      console.error("Error updating project", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update project" });
    }
  },
);

// 📩 SEND CONTACT MESSAGE
app.post("/api/contact", async (req, res) => {
  const { name, email, mobile, message } = req.body;

  try {
    const newMessage = {
      name,
      email,
      mobile,
      message,
    };
    const result = await db.collection("contacts").insertOne(newMessage);
    newMessage._id = result.insertedId;

    res.json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📥 GET ALL CONTACTS (Protected)
app.get("/api/contacts", checkAuth, async (req, res) => {
  try {
    const contacts = await db
      .collection("contacts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ❌ DELETE CONTACT (Protected)
app.delete("/api/contacts/:id", checkAuth, async (req, res) => {
  try {
    const deletedContact = await db
      .collection("contacts")
      .findOneAndDelete({ _id: new ObjectId(req.params.id) });

    if (!deletedContact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    res.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🎵 GET ALL MUSIC (Public)
app.get("/api/music", async (req, res) => {
  try {
    const tracks = await db
      .collection("music")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🎵 CREATE MUSIC (Protected)
app.post(
  "/api/music",
  checkAuth,
  uploadAudio.single("audio"),
  async (req, res) => {
    const { title, genre } = req.body;

    try {
      if (!title || !genre) {
        return res
          .status(400)
          .json({ success: false, message: "Title and genre are required" });
      }

      const newTrack = {
        title,
        genre,
        audioUrl: req.file ? req.file.path : "",
      };

      const result = await db.collection("music").insertOne(newTrack);
      res.status(201).json({ ...newTrack, _id: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

// 🎵 UPDATE MUSIC (Protected)
app.put(
  "/api/music/:id",
  checkAuth,
  uploadAudio.single("audio"),
  async (req, res) => {
    const { title, genre } = req.body;

    try {
      if (!title || !genre) {
        return res
          .status(400)
          .json({ success: false, message: "Title and genre are required" });
      }

      const updatePayload = {
        title,
        genre,
      };

      if (req.file) {
        updatePayload.audioUrl = req.file.path;
      }

      const updatedTrack = await db
        .collection("music")
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: updatePayload },
          { returnDocument: "after" },
        );

      if (!updatedTrack) {
        return res
          .status(404)
          .json({ success: false, message: "Music not found" });
      }

      res.json(updatedTrack);
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

// 🎵 DELETE MUSIC (Protected)
app.delete("/api/music/:id", checkAuth, async (req, res) => {
  try {
    const deletedTrack = await db
      .collection("music")
      .findOneAndDelete({ _id: new ObjectId(req.params.id) });

    if (!deletedTrack) {
      return res
        .status(404)
        .json({ success: false, message: "Music not found" });
    }

    res.json({ success: true, message: "Music deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= RESUME ROUTES =================
app.post(
  "/api/resume",
  checkAuth,
  uploadFile.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file provided" });
      }

      const fileUrl = req.file.path;

      // Keep only one resume doc
      await db.collection("resumes").deleteMany({});
      const newResume = { fileUrl };
      await db.collection("resumes").insertOne(newResume);

      res.json({ success: true, message: "Resume uploaded", fileUrl });
    } catch (error) {
      console.error("Resume upload error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

app.get("/api/resume", async (req, res) => {
  try {
    const resume = await db.collection("resumes").findOne();
    res.json({ success: true, fileUrl: resume ? resume.fileUrl : null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Multer error handler so unexpected upload fields return a clean response
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${error.message}`,
      code: error.code,
      field: error.field,
    });
  }

  return next(error);
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("==== CLOUDINARY CONFIG ====");
  console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
  console.log(
    "API_SECRET:",
    process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING",
  );
});
