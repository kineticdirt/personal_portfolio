import nodemailer from 'nodemailer';
import { parseEmailHeaders, extractMetadata } from './utils.js';

/**
 * Email processor for Cloudflare Email Routing
 * Receives emails, extracts metadata, and forwards to Gmail
 */

class EmailProcessor {
  constructor() {
    this.forwardTo = process.env.FORWARD_EMAIL || 'abhinav.allam@abhinavall.net';
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For now, just log emails. Will add SMTP relay later for actual forwarding
    this.transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }

  /**
   * Process incoming email from Cloudflare Email Workers
   */
  async processIncomingEmail(emailData) {
    try {
      const timestamp = new Date().toISOString();
      
      // Extract basic email info
      const from = emailData.from || 'unknown';
      const to = emailData.to || 'abhinav.allam@abhinavall.net';
      const subject = emailData.subject || '(no subject)';
      const body = emailData.text || emailData.html || '';
      
      // Extract metadata
      const metadata = this.extractEmailMetadata(emailData);
      
      // Log the email with metadata
      this.logEmail({
        timestamp,
        from,
        to,
        subject,
        metadata
      });
      
      // Prepare enriched email for forwarding
      const enrichedEmail = this.enrichEmailWithMetadata(emailData, metadata);
      
      // For now, just log. Will implement actual forwarding when SMTP relay is configured
      console.log('\n=== Email Received ===');
      console.log(`Time: ${timestamp}`);
      console.log(`From: ${from}`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('\nMetadata:');
      console.log(JSON.stringify(metadata, null, 2));
      console.log('\nBody preview:', body.substring(0, 200));
      console.log('=====================\n');
      
      return {
        success: true,
        message: 'Email processed successfully',
        metadata
      };
      
    } catch (error) {
      console.error('Email processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract metadata from email
   */
  extractEmailMetadata(emailData) {
    const metadata = {
      receivedAt: new Date().toISOString(),
      sender: {
        address: emailData.from,
        name: emailData.fromName || null,
        domain: this.extractDomain(emailData.from)
      },
      recipient: {
        address: emailData.to,
        localPart: emailData.to?.split('@')[0],
        domain: emailData.to?.split('@')[1]
      },
      message: {
        subject: emailData.subject,
        size: emailData.rawSize || (emailData.text?.length || 0),
        hasAttachments: emailData.attachments?.length > 0,
        attachmentCount: emailData.attachments?.length || 0
      },
      headers: this.parseHeaders(emailData.headers),
      security: {
        spf: emailData.headers?.['received-spf'] || 'unknown',
        dkim: emailData.headers?.['dkim-signature'] ? 'present' : 'absent',
        dmarc: emailData.headers?.['dmarc-policy'] || 'unknown'
      },
      routing: {
        forwardedTo: this.forwardTo,
        processedBy: 'linuxbox-email-processor',
        processorVersion: '1.0.0'
      }
    };
    
    return metadata;
  }

  /**
   * Extract domain from email address
   */
  extractDomain(email) {
    if (!email) return null;
    const match = email.match(/@(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Parse email headers into structured format
   */
  parseHeaders(headers) {
    if (!headers) return {};
    
    return {
      messageId: headers['message-id'],
      date: headers['date'],
      returnPath: headers['return-path'],
      replyTo: headers['reply-to'],
      inReplyTo: headers['in-reply-to'],
      references: headers['references'],
      contentType: headers['content-type']
    };
  }

  /**
   * Enrich email with metadata for forwarding
   */
  enrichEmailWithMetadata(emailData, metadata) {
    const metadataText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email Metadata (Processed by Linuxbox)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Received: ${metadata.receivedAt}
From: ${metadata.sender.address}
Domain: ${metadata.sender.domain}
Original To: ${metadata.recipient.address}

Message Size: ${metadata.message.size} bytes
Attachments: ${metadata.message.attachmentCount}

Security Checks:
  SPF: ${metadata.security.spf}
  DKIM: ${metadata.security.dkim}
  DMARC: ${metadata.security.dmarc}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Original Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    return {
      from: `${emailData.from} (via abhinav.allam@abhinavall.net)`,
      to: this.forwardTo,
      subject: `[Forwarded] ${emailData.subject}`,
      text: metadataText + (emailData.text || ''),
      html: emailData.html ? this.enrichHtmlWithMetadata(emailData.html, metadata) : null
    };
  }

  /**
   * Enrich HTML email with metadata
   */
  enrichHtmlWithMetadata(html, metadata) {
    const metadataHtml = `
      <div style="background: #f5f5f5; padding: 20px; margin-bottom: 20px; border-left: 4px solid #0066cc; font-family: monospace; font-size: 12px;">
        <h3 style="margin-top: 0;">📧 Email Metadata</h3>
        <p><strong>Received:</strong> ${metadata.receivedAt}</p>
        <p><strong>From:</strong> ${metadata.sender.address}</p>
        <p><strong>Domain:</strong> ${metadata.sender.domain}</p>
        <p><strong>Original To:</strong> ${metadata.recipient.address}</p>
        <p><strong>Size:</strong> ${metadata.message.size} bytes</p>
        <p><strong>Attachments:</strong> ${metadata.message.attachmentCount}</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">
        <p style="font-size: 11px; color: #666;">Processed by Linuxbox Email Processor</p>
      </div>
      <hr>
    `;
    
    return metadataHtml + html;
  }

  /**
   * Log email to file/database for analytics
   */
  logEmail(emailInfo) {
    // Simple file logging for now
    const logEntry = {
      ...emailInfo,
      loggedAt: new Date().toISOString()
    };
    
    // Could save to database or file here
    // For now, just console log
  }
}

export default new EmailProcessor();

