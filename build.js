// build.js

const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

// --- Configuration ---
const OUTPUT_DIR = path.join(__dirname, 'public');
const RESUME_PATH = path.join(__dirname, 'resume', 'Resume_AI_ML_V3.pdf');
const TEMPLATE_PATH = path.join(__dirname, 'index.html.template');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'index.html');

// --- Parsers ---

/**
 * Parses a block of text representing professional experience.
 * @param {string} text - The text block for a single job experience.
 * @returns {object} A structured object for a job.
 */
function parseExperience(text) {
  const lines = text.trim().split('\n').filter(line => line);
  const title = lines.shift()?.replace('###', '').trim() || '';
  
  const metaLine = lines.shift() || '';
  const companyMatch = metaLine.match(/\*\*Company:\*\* (.*?)(?=\s*\|)/);
  const locationMatch = metaLine.match(/\*\*Location:\*\* (.*?)(?=\s*\|)/);
  const dateMatch = metaLine.match(/\*\*Date:\*\* (.*)/);

  return {
    title,
    company: companyMatch ? companyMatch[1].trim() : '',
    location: locationMatch ? locationMatch[1].trim() : '',
    date: dateMatch ? dateMatch[1].trim() : '',
    points: lines.map(line => line.replace('-', '').trim()),
  };
}

/**
 * Parses a block of text representing projects.
 * @param {string} text - The text block for a single project.
 * @returns {object} A structured object for a project.
 */
function parseProject(text) {
  const lines = text.trim().split('\n').filter(line => line);
  const title = lines.shift()?.replace('###', '').trim() || '';
  const techLine = lines.shift() || '';
  const tech = techLine.replace('**Tech:**', '').trim();

  return {
    title,
    tech,
    points: lines.map(line => line.replace('-', '').trim()),
  };
}

/**
 * The main parsing orchestrator.
 * @param {string} resumeText - The full raw text from the PDF.
 * @returns {object} The fully structured resume data.
 */
function parseResumeText(resumeText) {
  const structuredData = {
    summary: '',
    experience: [],
    projects: [],
    skills: {},
  };

  const sections = resumeText.split('==================================').filter(s => s.trim());

  for (const section of sections) {
    const trimmedSection = section.trim();
    if (trimmedSection.startsWith('## SUMMARY')) {
      structuredData.summary = trimmedSection.replace('## SUMMARY', '').trim();
    } else if (trimmedSection.startsWith('## EXPERIENCE')) {
      const experienceEntries = trimmedSection.replace('## EXPERIENCE', '').trim().split('###').filter(e => e.trim());
      structuredData.experience = experienceEntries.map(entry => parseExperience(`### ${entry}`));
    } else if (trimmedSection.startsWith('## PROJECTS')) {
      const projectEntries = trimmedSection.replace('## PROJECTS', '').trim().split('###').filter(p => p.trim());
      structuredData.projects = projectEntries.map(entry => parseProject(`### ${entry}`));
    } else if (trimmedSection.startsWith('## SKILLS')) {
        const skillsText = trimmedSection.replace('## SKILLS', '').trim();
        skillsText.split('\n').forEach(line => {
            const [category, values] = line.split(':');
            const key = category.replace('**', '').replace('**', '').trim().toLowerCase();
            structuredData.skills[key] = values.split(',').map(v => v.trim());
        });
    }
  }

  return structuredData;
}

// --- HTML Generators ---

/**
 * Generates HTML for the experience section from structured data.
 * @param {Array<object>} experienceArray - Array of experience objects.
 * @returns {string} The generated HTML string.
 */
function generateExperienceHtml(experienceArray) {
  return experienceArray.map(job => `
    <div class="job">
      <h3>${job.title}</h3>
      <h4>${job.company} <span>| ${job.location} | ${job.date}</span></h4>
      <ul>
        ${job.points.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/**
 * Generates HTML for the projects section from structured data.
 * @param {Array<object>} projectsArray - Array of project objects.
 * @returns {string} The generated HTML string.
 */
function generateProjectsHtml(projectsArray) {
  return projectsArray.map(project => `
    <li>
      <h3>${project.title}</h3>
      <p><strong>Technologies:</strong> ${project.tech}</p>
      <ul>
        ${project.points.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </li>
  `).join('');
}

// --- Main Build Process ---

async function build() {
  console.log('🚀 Starting intelligent website build...');
  try {
    // 1. Read and Parse PDF
    const resumeBuffer = await fs.readFile(RESUME_PATH);
    const pdfData = await pdf(resumeBuffer);
    console.log('✅ Resume PDF parsed to raw text.');

    // 2. Convert Raw Text to Structured Data (JSON)
    const resumeData = parseResumeText(pdfData.text);
    console.log('✅ Raw text converted to structured JSON data.');

    // 3. Generate Dynamic HTML from Structured Data
    const experienceHtml = generateExperienceHtml(resumeData.experience);
    const projectsHtml = generateProjectsHtml(resumeData.projects);
    console.log('✅ Dynamic HTML content generated from data.');

    // 4. Inject into Template and Write to File
    const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');
    let outputHtml = template
      .replace('<!--EXPERIENCE_PLACEHOLDER-->', experienceHtml)
      .replace('<!--PROJECTS_PLACEHOLDER-->', projectsHtml);

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_PATH, outputHtml);
    console.log(`🎉 Build successful! Website written to ${OUTPUT_PATH}`);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();