module.exports.templates = {
  template1: (data) => {
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
      maxListItemSpacing -
      (maxListItemSpacing - minListItemSpacing) * scaleFactor
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
  },
  template2: (data) => {
    const {
      name,
      address,
      phone,
      email,
      links = [],
      about,
      skills = [],
      projects = [],
      experience = [],
      education = [],
    } = data;

    // Calculate content length for scaling
    const totalContentLength =
      (about ? about.length : 0) +
      skills.join("").length +
      projects.reduce(
        (acc, proj) => acc + proj.projectDescription?.join("").length || 0,
        0
      ) +
      experience.reduce(
        (acc, exp) => acc + exp.description?.join("").length || 0,
        0
      ) +
      education.reduce(
        (acc, edu) => (edu.degree?.length || 0) + (edu.university?.length || 0),
        0
      );

    // Scaling configuration
    const maxContentLength = 5000;
    const minFontSize = 8;
    const maxFontSize = 14;
    const minMargin = 2;
    const maxMargin = 5;
    const minPadding = 2;
    const maxPadding = 5;
    const minLineHeight = 1.3;
    const maxLineHeight = 1.6;

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
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: ${lineHeight};
                color: #333;
                background: #f9f9f9;
                font-size: ${baseFontSize};
                margin: 0;
                padding: 0;
            }
            .resume {
              max-width: 800px;
              margin: 0 auto;
              background: #fff;
              padding: 15px;
            }
            h1 {
                font-size: calc(${baseFontSize} * 2);
                color: #2c3e50;
                margin-bottom: calc(${baseMargin} * 0.5);
            }
            h2 {
                font-size: calc(${baseFontSize} * 1.571);
                color: #34495e;
                border-bottom: 2px solid #34495e;
                padding-bottom: calc(${basePadding} * 0.5);
                margin-bottom: ${baseMargin};
            }
            p {
                margin: ${baseMargin} 0;
            }
            a {
                color: #2980b9;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            .contact-info {
                margin-bottom: ${baseMargin};
            }
            .section {
                margin-bottom: calc(${baseMargin} * 1.5);
            }
            .section ul {
                padding-left: 20px;
            }
            .section ul li {
                margin-bottom: ${baseMargin};
            }
            .skills ul {
                list-style-type: none;
                padding: 0;
            }
            .skills ul li {
                display: inline-block;
                background: #ecf0f1;
                padding: calc(${basePadding} * 0.5) ${basePadding};
                margin: calc(${baseMargin} * 0.5);
                border-radius: 5px;
            }
            strong {
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="resume">
                <!-- Header Section -->
                <header>
                    <h1>${name}</h1>
                    <div class="contact-info">
                        ${
                          email
                            ? `<p>Email: <a href="mailto:${email}">${email}</a></p>`
                            : ""
                        }
                        ${
                          phone
                            ? `<p>Phone: <a href="tel:${phone}">${phone}</a></p>`
                            : ""
                        }
                        ${address ? `<p>Location: ${address}</p>` : ""}
                        ${links
                          .map(
                            (link) => `
                            <p>${link.title}: <a href="${
                              link.link
                            }" target="_blank">${new URL(link.link).hostname}${
                              new URL(link.link).pathname
                            }</a></p>
                        `
                          )
                          .join("")}
                    </div>
                </header>
  
                <!-- About Section -->
                ${
                  about
                    ? `
                <section class="section">
                    <h2>About</h2>
                    <p>${about}</p>
                </section>`
                    : ""
                }
                <!-- Skills Section -->
                ${
                  skills.length > 0
                    ? `
                <section class="section skills">
                    <h2>Skills</h2>
                    <ul>
                        ${skills.map((skill) => `<li>${skill}</li>`).join("")}
                    </ul>
                </section>`
                    : ""
                }
  
                <!-- Education Section -->
                ${
                  education.length > 0
                    ? `
                <section class="section">
                    <h2>Education</h2>
                    <ul>
                        ${education
                          .map(
                            (edu) => `
                            <li>
                                <strong>${edu.degree}</strong>
                                <p>${edu.university}${
                              edu.from ? ` (${edu.from} - ${edu.to})` : ""
                            }</p>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </section>`
                    : ""
                }
  
  
                <!-- Experience Section -->
                ${
                  experience.length > 0
                    ? `
                <section class="section">
                    <h2>Experience</h2>
                    <ul>
                        ${experience
                          .map(
                            (exp) => `
                            <li>
                                <strong>${exp.position}</strong> - ${
                              exp.companyName
                            }${exp.from ? ` (${exp.from} - ${exp.to})` : ""}
                                <ul>
                                    ${
                                      exp.description
                                        ?.map((line) => `<li>${line}</li>`)
                                        .join("") || ""
                                    }
                                </ul>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </section>`
                    : ""
                }
  
                <!-- Projects Section -->
                ${
                  projects.length > 0
                    ? `
                <section class="section">
                    <h2>Projects</h2>
                    <ul>
                        ${projects
                          .map(
                            (project) => `
                            <li>
                                <strong>${project.projectName}</strong>
                                <p>${
                                  project.projectDescription?.join(" ") || ""
                                }</p>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </section>`
                    : ""
                }
        </div>
    </body>
    </html>`;
  },
  template3: (data) => {},
};
