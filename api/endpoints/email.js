import express from 'express';
import emailProcessor from '../email/processor.js';

const router = express.Router();

/**
 * Webhook endpoint for Cloudflare Email Routing
 * This endpoint receives emails forwarded by Cloudflare Email Workers
 */
router.post('/incoming', async (req, res) => {
  try {
    console.log('Received email webhook from Cloudflare');
    
    // Cloudflare Email Workers sends email data in the request body
    const emailData = req.body;
    
    // Validate that we have email data
    if (!emailData || !emailData.from) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email data'
      });
    }
    
    // Process the email
    const result = await emailProcessor.processIncomingEmail(emailData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Email processed successfully',
        metadata: result.metadata
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Email webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error processing email'
    });
  }
});

/**
 * Test endpoint to verify email processing is working
 */
router.post('/test', async (req, res) => {
  try {
    const testEmail = {
      from: req.body.from || 'test@example.com',
      to: 'abhinav.allam@abhinavall.net',
      subject: req.body.subject || 'Test Email',
      text: req.body.text || 'This is a test email',
      headers: {
        'message-id': '<test@example.com>',
        'date': new Date().toISOString()
      },
      rawSize: 1024
    };
    
    const result = await emailProcessor.processIncomingEmail(testEmail);
    
    res.json({
      success: true,
      message: 'Test email processed',
      result
    });
    
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get email statistics
 */
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      emailAddress: 'abhinav.allam@abhinavall.net',
      forwardTo: process.env.FORWARD_EMAIL || 'abhinav.allam@abhinavall.net',
      processorStatus: 'active',
      version: '1.0.0'
    }
  });
});

export default router;

