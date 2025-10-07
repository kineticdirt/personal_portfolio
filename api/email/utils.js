/**
 * Email utility functions
 */

/**
 * Parse email headers into structured format
 */
export function parseEmailHeaders(headers) {
  if (typeof headers === 'string') {
    const headerObj = {};
    const lines = headers.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        headerObj[key] = value;
      }
    });
    
    return headerObj;
  }
  
  return headers || {};
}

/**
 * Extract metadata from email
 */
export function extractMetadata(emailData) {
  return {
    timestamp: new Date().toISOString(),
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    size: emailData.size || 0,
    headers: parseEmailHeaders(emailData.headers)
  };
}

/**
 * Validate email address format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extract domain from email address
 */
export function extractDomain(email) {
  if (!email || !isValidEmail(email)) return null;
  const parts = email.split('@');
  return parts[1] || null;
}

/**
 * Format email for display
 */
export function formatEmailForDisplay(emailData) {
  return {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    date: new Date(emailData.date || Date.now()).toLocaleString(),
    preview: (emailData.text || '').substring(0, 100) + '...'
  };
}

