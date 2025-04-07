module.exports.template1 = `
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
