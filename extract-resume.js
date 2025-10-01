// Extract content from AI_ML_V4 resume using Gemini API
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function extractResumeContent() {
    const apiKey = 'AIzaSyAiEZRt9BrH0ULle29qu03l_AqMiN7cQOM';
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    try {
        // Read the PDF file
        const pdfPath = path.join(process.cwd(), 'assets', 'documents', 'Resume_AI_ML_V4_Large.pdf');
        const pdfBuffer = fs.readFileSync(pdfPath);
        const base64Pdf = pdfBuffer.toString('base64');
        
        const prompt = `
Extract the following information from this resume PDF and format it as JSON:

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

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
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
        const text = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const resumeData = JSON.parse(jsonMatch[0]);
            console.log('Extracted Resume Data:', JSON.stringify(resumeData, null, 2));
            return resumeData;
        } else {
            throw new Error('No valid JSON found in response');
        }
        
    } catch (error) {
        console.error('Error extracting resume content:', error);
        throw error;
    }
}

// Run the extraction
extractResumeContent().catch(console.error);
