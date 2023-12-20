const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const app = express();
const PORT = 3002;
const MongoDB = require("./db");
const UserProfile = require("./Models/userProfile");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

MongoDB();

// Fetch user profile
app.get("/api/user/profile", async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({});
    res.json(userProfile || {});
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
app.put("/api/user/profile", upload.single("profileImage"), async (req, res) => {
  const newProfile = req.body;

  // Handle image upload
  if (req.file) {
    const profileImage = Buffer.from(req.file.buffer).toString("base64");
    newProfile.profileImage = `data:${req.file.mimetype};base64,${profileImage}`;
  }

  try {
    await UserProfile.findOneAndUpdate({}, newProfile, { upsert: true });
    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api", require("./Routes/NewUser"));

// New route to generate a code from a product link
app.post("/api/generate", async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: "Link is required" });
  }

  try {
    const { nanoid } = await import("nanoid");
    const code = nanoid(5);
    // Assuming items is a global variable, consider using a database to store such data
    items.push({ code, link });
    res.json({ code, link });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/generate-link", (req, res) => {
  const { code } = req.body;
  const item = items.find((item) => item.code === code);

  if (item) {
    res.json({ link: item.link });
  } else {
    res.status(404).json({ error: "Code not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
