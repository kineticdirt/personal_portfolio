import express from 'express';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Feedback directory
const FEEDBACK_DIR = path.join(__dirname, '../../feedback');
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'feedback.json');

// Ensure feedback directory exists
if (!fsSync.existsSync(FEEDBACK_DIR)) {
    fsSync.mkdirSync(FEEDBACK_DIR, { recursive: true });
}

// Initialize feedback file if it doesn't exist
if (!fsSync.existsSync(FEEDBACK_FILE)) {
    fsSync.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2));
}

// Helper function to read feedback
async function readFeedback() {
    try {
        const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading feedback:', error);
        return [];
    }
}

// Helper function to write feedback
async function writeFeedback(feedback) {
    try {
        await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing feedback:', error);
        return false;
    }
}

// POST /api/feedback - Submit feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, linkedin, type, message, timestamp, userAgent, pageUrl } = req.body;

        // Validate required fields
        if (!name || !email || !type || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create feedback entry
        const feedbackEntry = {
            id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            linkedin: linkedin || null,
            type,
            message,
            timestamp: timestamp || new Date().toISOString(),
            userAgent: userAgent || null,
            pageUrl: pageUrl || null,
            submittedAt: new Date().toISOString()
        };

        // Read existing feedback
        const allFeedback = await readFeedback();

        // Add new feedback
        allFeedback.push(feedbackEntry);

        // Write back to file
        const success = await writeFeedback(allFeedback);

        if (success) {
            // Also append to daily log file
            const date = new Date().toISOString().split('T')[0];
            const dailyLogFile = path.join(FEEDBACK_DIR, `feedback_${date}.txt`);
            
            const logEntry = `
================================================================================
Feedback ID: ${feedbackEntry.id}
Date/Time: ${feedbackEntry.submittedAt}
Type: ${feedbackEntry.type}
--------------------------------------------------------------------------------
Name: ${feedbackEntry.name}
Email: ${feedbackEntry.email}
LinkedIn: ${feedbackEntry.linkedin || 'N/A'}
Page: ${feedbackEntry.pageUrl || 'N/A'}
User Agent: ${feedbackEntry.userAgent || 'N/A'}
--------------------------------------------------------------------------------
Message:
${feedbackEntry.message}
================================================================================

`;

            await fs.appendFile(dailyLogFile, logEntry, 'utf-8');

            console.log(`✅ Feedback received from ${name} (${email}) - Type: ${type}`);

            res.json({
                success: true,
                message: 'Feedback submitted successfully',
                feedbackId: feedbackEntry.id
            });
        } else {
            throw new Error('Failed to save feedback');
        }

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback'
        });
    }
});

// GET /api/feedback/summary - Get daily summary
router.get('/summary', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        // Read all feedback
        const allFeedback = await readFeedback();

        // Filter feedback for the target date
        const dailyFeedback = allFeedback.filter(fb => {
            const fbDate = new Date(fb.submittedAt).toISOString().split('T')[0];
            return fbDate === targetDate;
        });

        // Generate summary
        const summary = {
            date: targetDate,
            totalCount: dailyFeedback.length,
            byType: {
                bug: dailyFeedback.filter(fb => fb.type === 'bug').length,
                feature: dailyFeedback.filter(fb => fb.type === 'feature').length,
                complaint: dailyFeedback.filter(fb => fb.type === 'complaint').length,
                praise: dailyFeedback.filter(fb => fb.type === 'praise').length,
                other: dailyFeedback.filter(fb => fb.type === 'other').length
            },
            feedback: dailyFeedback.map(fb => ({
                id: fb.id,
                name: fb.name,
                email: fb.email,
                type: fb.type,
                message: fb.message.substring(0, 100) + (fb.message.length > 100 ? '...' : ''),
                timestamp: fb.submittedAt
            }))
        };

        res.json({
            success: true,
            summary
        });

    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating summary'
        });
    }
});

// GET /api/feedback/all - Get all feedback (admin only - add auth if needed)
router.get('/all', async (req, res) => {
    try {
        const allFeedback = await readFeedback();

        res.json({
            success: true,
            count: allFeedback.length,
            feedback: allFeedback
        });

    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback'
        });
    }
});

// GET /api/feedback/stats - Get statistics
router.get('/stats', async (req, res) => {
    try {
        const allFeedback = await readFeedback();

        const stats = {
            total: allFeedback.length,
            byType: {
                bug: allFeedback.filter(fb => fb.type === 'bug').length,
                feature: allFeedback.filter(fb => fb.type === 'feature').length,
                complaint: allFeedback.filter(fb => fb.type === 'complaint').length,
                praise: allFeedback.filter(fb => fb.type === 'praise').length,
                other: allFeedback.filter(fb => fb.type === 'other').length
            },
            recent: allFeedback.slice(-10).reverse()
        };

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats'
        });
    }
});

export default router;

