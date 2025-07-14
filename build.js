// build.js

const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

// --- Configuration ---
const RESUME_PATH = path.join(__dirname, 'resume', 'Resume_AI_ML_V3.pdf');
const TEMPLATE_PATH = path.join(__dirname, 'index.html.template');
const OUTPUT_PATH = path.join(__dirname, 'index.html');

// --- HTML Generation Functions ---
// (Your existing functions for generateExperienceHtml, generateProjectsHtml go here...)
// (No changes needed in this part)
function generateExperienceHtml(text) {
  const sectionTextMatch = text.match(/###EXPERIENCE###([\s\S]*?)###/);
  if (!sectionTextMatch) return '';
  const entries = sectionTextMatch[1].trim().split('---');
  return entries.map(entry => {
    const company = entry.match(/Company: (.*)/)?.[1] || '';
    const title = entry.match(/Title: (.*)/)?.[1] || '';
    const date = entry.match(/Date: (.*)/)?.[1] || '';
    const location = entry.match(/Location: (.*)/)?.[1] || '';
    const points = [...entry.matchAll(/- (.*)/g)].map(match => `<li>${match[1]}</li>`).join('');
    return `
      <div class="job">
        <h3>${title}</h3>
        <h4>${company} <span>| ${location} | ${date}</span></h4>
        <ul>${points}</ul>
      </div>
    `;
  }).join('');
}
function generateProjectsHtml(text) {
  const sectionTextMatch = text.match(/###PROJECTS###([\s\S]*?)###/);
  if (!sectionTextMatch) return '';
  const entries = sectionTextMatch[1].trim().split('---');
  return entries.map(entry => {
    const title = entry.match(/Title: (.*)/)?.[1] || '';
    const tech = entry.match(/Tech: (.*)/)?.[1] || '';
    const date = entry.match(/Date: (.*)/)?.[1] || '';
    const points = [...entry.matchAll(/- (.*)/g)].map(match => `<li>${match[1]}</li>`).join('');
    return `
      <li>
        <h3>${title} <span>${date}</span></h3>
        <p><strong>Technologies:</strong> ${tech}</p>
        <ul>${points}</ul>
      </li>
    `;
  }).join('');
}


// --- Main Build Process ---

async function build() {
  // ==================== NEW DEBUGGING CODE ====================
  console.log('--- Debugging Info ---');
  console.log('Current working directory (where node was run):', process.cwd());
  console.log('Script directory (__dirname):', __dirname);
  console.log('Attempting to read resume from this exact path:', RESUME_PATH);
  console.log('----------------------');
  // ==========================================================

  console.log('🚀 Starting website build...');

  try {
    const resumeBuffer = await fs.readFile(RESUME_PATH);
    const pdfData = await pdf(resumeBuffer);
    // ... rest of your build script ...
    const resumeText = pdfData.text;
    console.log('✅ Resume PDF parsed successfully.');
    const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');
    console.log('✅ HTML template read successfully.');
    const experienceHtml = generateExperienceHtml(resumeText);
    const projectsHtml = generateProjectsHtml(resumeText);
    console.log('✅ Dynamic HTML content generated.');
    let outputHtml = template
      .replace('<!--EXPERIENCE_PLACEHOLDER-->', experienceHtml)
      .replace('<!--PROJECTS_PLACEHOLDER-->', projectsHtml);
    await fs.writeFile(OUTPUT_PATH, outputHtml);
    console.log(`🎉 Build successful! Website written to ${OUTPUT_PATH}`);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();