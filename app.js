const express = require("express");
const app = express();
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const Resume = require("./models/Resume");
const datefns = require("date-fns");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { createToken } = require("./utils");
const { cloudinary } = require("./cloudinary");
const { verifyToken } = require("./middleware");
const { templates } = require("./constants");
const Template = require("./models/Template");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/resumate");

app.get("/", (req, res) => {
  res.json({ message: "This is the backend for Resumate" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const savedUser = await new User({
    username: username,
    password: hashedPassword,
  }).save();
  res.json({ user: savedUser });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const passwordVerification = await bcrypt.compare(password, user.password);
  if (!passwordVerification)
    return res.status(401).json({ message: "Invalid username of password" });

  const token = createToken(user.id);
  res.json({ user: user, token: token });
});

app.get("/profile", verifyToken, async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.json(user);
});

app.delete("/profile", verifyToken, async (req, res) => {
  const { id } = req.user;
  const deletedUser = await User.findByIdAndDelete(id);

  const resumesToDelete = await Resume.find({ userId: id });

  await Resume.deleteMany({ userId: id });

  const urlParts = resumesToDelete.map((resume) => resume.url.split("/"));
  const filenames = urlParts.map((urlPart) => urlPart.pop());
  const public_ids = filenames.map((filename) => filename.split(".")[0]);

  await Promise.all(
    public_ids.map((public_id) => cloudinary.uploader.destroy(public_id))
  );

  res.json({ deletedUser, deletedResumes: resumesToDelete });
});

async function generatePdf(html) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({
    format: "A4",
  });
  await browser.close();

  return pdfBuffer;
}

app.get("/resume", verifyToken, async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const resumes = await Resume.find({ userId: id });
  res.json(resumes);
});

app.delete("/resume/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const deletedResume = await Resume.findByIdAndDelete(id);

  const urlParts = deletedResume.url.split("/");
  const filename = urlParts.pop();
  const public_id = filename.split(".")[0];

  await cloudinary.uploader.destroy(public_id);

  res.json(deletedResume);
});

app.get("/templates", async (req, res) => {
  const templates = await Template.find({});
  res.json(templates);
});

app.post("/resume", verifyToken, async (req, res) => {
  const { id } = req.user;
  const {
    name,
    address,
    phone,
    email,
    links,
    about,
    skills,
    projects,
    experience,
    education,
    template,
  } = req.body;

  console.log(req.body.projects);

  let html;
  if (template === 1) {
    html = templates.template1({
      name,
      address,
      phone,
      email,
      links,
      about,
      skills,
      projects,
      experience,
      education,
    });
  } else if (template === 2) {
    html = templates.template2({
      name,
      address,
      phone,
      email,
      links,
      about,
      skills,
      projects,
      experience,
      education,
    });
  }

  const pdfBuffer = await generatePdf(html);

  //save pdf file to cloudinary
  const cloudinaryResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", format: "pdf", folder: "Resumate" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(pdfBuffer);
  });

  // preview url
  const previewUrl = cloudinary.url(cloudinaryResponse.public_id, {
    format: "png",
    page: 1,
  });

  //save pdf url and user id to backend
  const savedResume = await new Resume({
    userId: id,
    url: cloudinaryResponse.secure_url,
    previewUrl: previewUrl,
  }).save();

  res.json({ url: savedResume.url, previewUrl: previewUrl });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on PORT 3000");
});
