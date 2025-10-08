import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import emailRouter from './endpoints/email.js';
import feedbackRouter from './endpoints/feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Adjust as needed for your assets
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' })); // Increased limit for email content
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/email', emailRouter);
app.use('/api/feedback', feedbackRouter);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Contact form endpoint - basic logging
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Log submission with timestamp
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Contact form submission:`, { name, email, message });
    
    res.json({ 
      success: true, 
      message: 'Message received successfully' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process message' 
    });
  }
});

// Example: Analytics endpoint
app.post('/api/analytics', (req, res) => {
  try {
    const { event, data } = req.body;
    
    // Add your analytics logic here
    console.log('Analytics event:', event, data);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false });
  }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

