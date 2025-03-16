const express = require("express");
const app = express();
const mongoose = require("mongoose");
const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const Resume = require("./models/Resume");
const datefns = require("date-fns");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { createToken } = require("./utils");
const { cloudinary } = require("./cloudinary");
const { verifyToken } = require("./middleware");
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

async function generatePdf(html) {
  const browser = await puppeteer.launch({
    executablePath: await chrome.executablePath,
    args: chrome.args,
    headless: chrome.headless,
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
  } = req.body;

  console.log(req.body.projects);

  const html = generateResumeHTML({
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

function generateResumeHTML(data) {
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
  } = data;

  const updatedProjects = projects.map((project) => ({
    ...project,
    // from: datefns.format(new Date(project.from), "d MMM, yyyy"),
    // to: datefns.format(new Date(project.to), "d MMM, yyyy"),
  }));

  const updatedExperience = experience.map((exp) => ({
    ...exp,
    // from: datefns.format(new Date(exp.from), "d MMM, yyyy"),
    // to: datefns.format(new Date(exp.to), "d MMM, yyyy"),
  }));
  const updatedEdutcation = education.map((edu) => ({
    ...edu,
    // from: datefns.format(new Date(edu.from), "d MMM, yyyy"),
    // to: datefns.format(new Date(edu.to), "d MMM, yyyy"),
  }));

  const totalContentLength =
    (about ? about.length : 0) +
    (skills ? skills.join("").length : 0) +
    (updatedProjects
      ? updatedProjects.reduce(
          (acc, proj) => acc + proj.projectDescription.join("").length,
          0
        )
      : 0) +
    (updatedExperience
      ? updatedExperience.reduce(
          (acc, exp) => acc + exp.description.join("").length,
          0
        )
      : 0) +
    (updatedEdutcation
      ? updatedEdutcation.reduce(
          (acc, edu) => acc + edu.degree.length + edu.university.length,
          0
        )
      : 0);

  const maxContentLength = 5000;
  const minFontSize = 8;
  const maxFontSize = 14;
  const minMargin = 2;
  const maxMargin = 5;
  const minPadding = 2;
  const maxPadding = 5;
  const minLineHeight = 1.1;
  const maxLineHeight = 1.4;
  const minListItemSpacing = 1;
  const maxListItemSpacing = 4;

  const scaleFactor = Math.min(totalContentLength / maxContentLength, 1);
  const baseFontSize = `${
    maxFontSize - (maxFontSize - minFontSize) * scaleFactor
  }px`;
  const baseMargin = `${maxMargin - (maxMargin - minMargin) * scaleFactor}px`;
  const basePadding = `${
    maxPadding - (maxPadding - minPadding) * scaleFactor
  }px`;
  const lineHeight =
    maxLineHeight - (maxLineHeight - minLineHeight) * scaleFactor;
  const listItemSpacing = `${
    maxListItemSpacing - (maxListItemSpacing - minListItemSpacing) * scaleFactor
  }px`;

  return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${name} - Resume</title>
              <style>
                  @page {
                      size: A4;
                      margin: 5mm; 
                  }
                  * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                  }
                  body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      line-height: ${lineHeight}; 
                      margin: 0;
                      padding: 0;
                      color: #333;
                      background: #f9f9f9;
                      font-size: ${baseFontSize}; 
                  }
                  .resume {
                      max-width: 800px;
                      margin: 0 auto;
                      background: #fff;
                      padding: ${basePadding};
                  }
                  h1 {
                      font-size: calc(${baseFontSize} * 1.5);
                      margin-bottom: ${baseMargin};
                      color: #226666;
                      text-align: center;
                  }
                  h2 {
                      font-size: calc(${baseFontSize} * 1.2);
                      margin-bottom: ${baseMargin};
                      color: #226666;
                      border-bottom: 1px solid #226666; 
                      padding-bottom: ${basePadding};
                  }
                  p {
                      margin: ${baseMargin} 0;
                      font-size: ${baseFontSize};
                  }
                  a {
                      color: #0000ff;
                      text-decoration: none;
                  }
                  a:hover {
                      text-decoration: underline;
                  }
                  .contact-info {
                      text-align: center;
                      margin-bottom: ${baseMargin};
                  }
                  .contact-info a {
                      margin: 0 5px;
                      font-size: ${baseFontSize};
                  }
                  .section {
                      margin-bottom: ${baseMargin};
                  }
                  .section ul {
                      padding-left: 15px;
                      margin: ${baseMargin} 0;
                  }
                  .section ul li {
                      margin-bottom: ${listItemSpacing};
                      font-size: ${baseFontSize};
                  }
                  .subheader {
                      display: flex;
                      justify-content: space-between;
                      font-weight: bold;
                      margin-bottom: ${baseMargin};
                  }
                  .skills ul {
                      list-style-type: none;
                      padding: 0;
                      margin: ${baseMargin} 0;
                  }
                  .skills ul li {
                      display: inline-block;
                      background: #ecf0f1;
                      padding: 3px 8px;
                      margin: 3px; 
                      border-radius: 3px;
                      font-size: ${baseFontSize};
                  }
                  .company-name {
                      font-style: italic;
                      font-weight: bold;
                  }
              </style>
          </head>
          <body>
              <div class="resume">
                  <!-- Header -->
                  <header>
                      <h1>${name}</h1>
                      <div class="contact-info">
                          <p>
                              ${
                                phone
                                  ? `<a href="tel:${phone}">${phone}</a> | `
                                  : ""
                              }
                              ${
                                email
                                  ? `<a href="mailto:${email}">${email}</a> | `
                                  : ""
                              }
                              ${address ? `${address} | ` : ""}
                              ${
                                links
                                  ? links
                                      .map(
                                        (link) =>
                                          `<a href="${link.link}" target="_blank">${link.title}</a>`
                                      )
                                      .join(" | ")
                                  : ""
                              }
                          </p>
                      </div>
                  </header>
      
                  <!-- About Section -->
                  ${
                    about
                      ? `<section class="section">
                          <h2>About Me</h2>
                          <p>${about}</p>
                         </section>`
                      : ""
                  }
      
                  <!-- Skills Section -->
                  ${
                    skills.length > 0
                      ? `<section class="section">
                          <h2>Technical Skills</h2>
                          <ul>
                              ${skills
                                .map((skill) => `<li>${skill}</li>`)
                                .join("")}
                          </ul>
                         </section>`
                      : ""
                  }
      
                  <!-- Projects Section -->
                  ${
                    updatedProjects.length > 0
                      ? `<section class="section">
                          <h2>Projects</h2>
                          ${updatedProjects
                            .map(
                              (project) => `
                              <div class="subheader">
                                  <h3>${project.projectName}</h3>
                                  <span>${
                                    project.from
                                      ? `${project.from} - ${project.to}`
                                      : ""
                                  }</span>
                              </div>
                              <ul>
                                  ${project.projectDescription
                                    .map((line) => `<li>${line}</li>`)
                                    .join("")}
                              </ul>`
                            )
                            .join("")}
                         </section>`
                      : ""
                  }
      
                  <!-- Experience Section -->
                  ${
                    updatedExperience.length > 0
                      ? `<section class="section">
                          <h2>Experience</h2>
                          ${updatedExperience
                            .map(
                              (exp) => `
                              <div class="subheader">
                                  <h3>${exp.position}</h3>
                                  <span>${
                                    exp.from ? `${exp.from} - ${exp.to}` : ""
                                  }</span>
                              </div>
                              <p class="company-name">${exp.companyName}</p>
                              <p>${exp.location}</p>
                              <ul>
                                  ${exp.description
                                    .map((line) => `<li>${line}</li>`)
                                    .join("")}
                              </ul>`
                            )
                            .join("")}
                         </section>`
                      : ""
                  }
      
                  <!-- Education Section -->
                  ${
                    updatedEdutcation.length > 0
                      ? `<section class="section">
                          <h2>Education</h2>
                          ${updatedEdutcation
                            .map(
                              (edu) => `
                              <div class="subheader">
                                  <h3>${edu.degree}</h3>
                                  <span>${
                                    edu.from ? `${edu.from} - ${edu.to}` : ""
                                  }</span>
                              </div>
                              <p class="company-name">${edu.university}</p>
                              <p>${edu.location}</p>`
                            )
                            .join("")}
                         </section>`
                      : ""
                  }
              </div>
          </body>
          </html>
        `;
}
// Start the server
module.exports = app;
