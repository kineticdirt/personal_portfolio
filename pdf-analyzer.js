// PDF Analyzer using Gemini API
class PDFAnalyzer {
    constructor() {
        this.apiKey = 'AIzaSyAiEZRt9BrH0ULle29qu03l_AqMiN7cQOM';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    async analyzeResume(pdfFile) {
        try {
            // Convert PDF to base64
            const base64Pdf = await this.fileToBase64(pdfFile);
            
            // Create structured prompt for resume analysis
            const prompt = this.createResumePrompt();
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': this.apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                },
                                {
                                    inline_data: {
                                        mime_type: "application/pdf",
                                        data: base64Pdf
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.1,
                        topK: 32,
                        topP: 1,
                        maxOutputTokens: 4096,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return this.parseGeminiResponse(data);
            
        } catch (error) {
            console.error('Error analyzing PDF:', error);
            throw error;
        }
    }

    createResumePrompt() {
        return `
Analyze this resume PDF and extract the following information in JSON format. Be precise and accurate:

{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "city, state",
    "linkedin": "linkedin profile",
    "github": "github profile"
  },
  "summary": "Professional summary or objective (2-3 sentences)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "description": "Brief job description",
      "achievements": [
        "Key achievement 1",
        "Key achievement 2",
        "Key achievement 3"
      ],
      "projects": [
        "Project name 1 - brief description",
        "Project name 2 - brief description"
      ],
      "technologies": [
        "Technology 1",
        "Technology 2",
        "Technology 3"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Type",
      "institution": "University Name",
      "location": "City, State",
      "graduationDate": "MM/YYYY",
      "gpa": "GPA if mentioned",
      "relevantCoursework": ["Course 1", "Course 2"]
    }
  ],
  "skills": {
    "programming": ["Language 1", "Language 2"],
    "frameworks": ["Framework 1", "Framework 2"],
    "tools": ["Tool 1", "Tool 2"],
    "databases": ["Database 1", "Database 2"],
    "cloud": ["Cloud Service 1", "Cloud Service 2"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"],
      "github": "github link if available",
      "liveDemo": "live demo link if available"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "MM/YYYY",
      "credentialId": "Credential ID if available"
    }
  ]
}

Please analyze the resume carefully and provide accurate information. If any section is not present, use an empty array or null as appropriate.`;
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    parseGeminiResponse(data) {
        try {
            const text = data.candidates[0].content.parts[0].text;
            
            // Extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in response');
            }
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            throw new Error('Failed to parse API response');
        }
    }

    async populateWebsite(resumeData) {
        // Update personal info
        this.updatePersonalInfo(resumeData.personalInfo);
        
        // Update experience section
        this.updateExperienceSection(resumeData.experience);
        
        // Update skills section
        this.updateSkillsSection(resumeData.skills);
        
        // Update projects section
        this.updateProjectsSection(resumeData.projects);
        
        // Update about section
        this.updateAboutSection(resumeData.summary);
        
        // Update statistics
        this.updateStatistics(resumeData.experience, resumeData.projects);
        
        console.log('Website populated with resume data:', resumeData);
    }

    updatePersonalInfo(personalInfo) {
        // Update hero section
        const nameElement = document.querySelector('.hero-title');
        if (nameElement && personalInfo.name) {
            nameElement.textContent = personalInfo.name;
        }

        // Update contact info
        const emailElement = document.querySelector('a[href^="mailto:"]');
        if (emailElement && personalInfo.email) {
            emailElement.href = `mailto:${personalInfo.email}`;
            emailElement.textContent = personalInfo.email;
        }

        // Update GitHub link
        const githubElement = document.querySelector('a[href*="github.com"]');
        if (githubElement && personalInfo.github) {
            githubElement.href = personalInfo.github;
        }
    }

    updateExperienceSection(experience) {
        const timeline = document.querySelector('.experience-timeline');
        if (!timeline || !experience) return;

        // Clear existing placeholder
        timeline.innerHTML = '';

        experience.forEach((job, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-expanded', 'false');
            
            timelineItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${job.startDate} - ${job.endDate}</div>
                    <h3 class="timeline-title">${job.title}</h3>
                    <h4 class="timeline-company">${job.company}</h4>
                    <p class="timeline-description">${job.description}</p>
                    <div class="timeline-tech">
                        ${job.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="timeline-expanded" style="display: none;">
                        <div class="expanded-content">
                            <h4>Key Achievements:</h4>
                            <ul>
                                ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                            <h4>Projects:</h4>
                            <ul>
                                ${job.projects.map(project => `<li>${project}</li>`).join('')}
                            </ul>
                            <h4>Technologies Used:</h4>
                            <div class="tech-grid">
                                ${job.technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });

        // Re-initialize expansion functionality
        if (window.portfolioApp) {
            window.portfolioApp.setupExperienceExpansion();
        }
    }

    updateSkillsSection(skills) {
        const skillsContent = document.querySelector('.skills-content');
        if (!skillsContent || !skills) return;

        skillsContent.innerHTML = `
            <div class="skill-category">
                <h3>Programming Languages</h3>
                <div class="skill-tags">
                    ${skills.programming.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="skill-category">
                <h3>Frameworks & Libraries</h3>
                <div class="skill-tags">
                    ${skills.frameworks.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="skill-category">
                <h3>Tools & Technologies</h3>
                <div class="skill-tags">
                    ${skills.tools.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="skill-category">
                <h3>Databases</h3>
                <div class="skill-tags">
                    ${skills.databases.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="skill-category">
                <h3>Cloud Services</h3>
                <div class="skill-tags">
                    ${skills.cloud.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    updateProjectsSection(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || !projects) return;

        projectsGrid.innerHTML = projects.map(project => `
            <article class="project-card">
                <div class="project-image">
                    <div class="project-placeholder">
                        <i class="fas fa-code"></i>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
                        ${project.liveDemo ? `<a href="${project.liveDemo}" target="_blank" rel="noopener">Live Demo</a>` : ''}
                    </div>
                </div>
            </article>
        `).join('');
    }

    updateAboutSection(summary) {
        const aboutCards = document.querySelectorAll('.about-card');
        if (aboutCards.length >= 2 && summary) {
            aboutCards[1].querySelector('p').textContent = summary;
        }
    }

    updateStatistics(experience, projects) {
        // Calculate years of experience
        const years = this.calculateYearsOfExperience(experience);
        
        // Update statistics
        const yearsElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (yearsElement) {
            yearsElement.textContent = `${years}+`;
        }

        const projectsElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (projectsElement && projects) {
            projectsElement.textContent = `${projects.length}+`;
        }
    }

    calculateYearsOfExperience(experience) {
        if (!experience || experience.length === 0) return 0;
        
        const startDates = experience.map(job => {
            const [month, year] = job.startDate.split('/');
            return new Date(year, month - 1);
        });
        
        const earliestStart = new Date(Math.min(...startDates));
        const now = new Date();
        const years = (now - earliestStart) / (1000 * 60 * 60 * 24 * 365);
        
        return Math.floor(years);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFAnalyzer;
} else {
    window.PDFAnalyzer = PDFAnalyzer;
}
