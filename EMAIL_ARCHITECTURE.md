# Email System Architecture

Complete architecture for `abhinav.allam@abhinavall.net` email system.

## System Components

### 1. Cloudflare Email Routing
- **Purpose**: Receive emails at custom domain
- **Location**: Cloudflare servers
- **Cost**: Free, unlimited
- **Configuration**: Cloudflare Dashboard > Email

### 2. Cloudflare Email Worker
- **Purpose**: Process emails, extract metadata, forward to linuxbox
- **Location**: Cloudflare Edge
- **Language**: JavaScript
- **Configuration**: Workers & Pages > email-processor

### 3. Linuxbox API (Express Server)
- **Purpose**: Process emails locally, add metadata, log analytics
- **Location**: Your home linuxbox (192.168.1.191)
- **Exposed via**: Cloudflare Tunnel (https://portfolio.abhinavall.net)
- **Endpoints**:
  - `POST /api/email/incoming` - Webhook for Cloudflare Worker
  - `POST /api/email/test` - Test endpoint
  - `GET /api/email/stats` - Statistics

### 4. Email Processor Module
- **Purpose**: Core email processing logic
- **Location**: `api/email/processor.js`
- **Features**:
  - Metadata extraction
  - Sender analysis
  - Security check parsing (SPF/DKIM/DMARC)
  - Email enrichment

### 5. Gmail Integration
- **Purpose**: Final destination for received emails
- **Configuration**: Cloudflare Worker forwards to Gmail
- **Sending**: Gmail "Send As" with SMTP relay

## Data Flow

### Receiving Emails

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Email sent to abhinav.allam@abhinavall.net              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Cloudflare Email Routing (MX records)                    │
│    - Receives email                                          │
│    - Spam filtering                                          │
│    - Routes to Email Worker                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Cloudflare Email Worker                                   │
│    - Extracts headers                                        │
│    - Gets email content (text/html)                          │
│    - Parses metadata                                         │
│    - Sends to linuxbox webhook                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Linuxbox API (/api/email/incoming)                       │
│    - Receives email data via HTTPS                           │
│    - Processes through EmailProcessor                        │
│    - Adds enriched metadata:                                 │
│      • Sender domain analysis                                │
│      • Security check parsing                                │
│      • Timestamp & size info                                 │
│      • Custom analytics                                      │
│    - Logs to console/file                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Forward to Gmail (abhinavall0123@gmail.com)              │
│    - Email with metadata prepended                           │
│    - Original content preserved                              │
│    - Readable format                                         │
└─────────────────────────────────────────────────────────────┘
```

### Sending Emails

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Compose in Gmail (abhinavall0123@gmail.com)              │
│    - Select "From: abhinav.allam@abhinavall.net"            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Gmail "Send As" Feature                                   │
│    - Uses configured SMTP relay                              │
│    - Authenticates with API key                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SMTP Relay (SendGrid/Mailgun)                            │
│    - Validates sender domain                                 │
│    - Adds DKIM signature                                     │
│    - Delivers to recipient                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Recipient receives email                                  │
│    - From: abhinav.allam@abhinavall.net                      │
│    - No "via gmail.com" warning                              │
│    - Professional appearance                                 │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### POST /api/email/incoming
Webhook endpoint for Cloudflare Email Worker.

**Request Body:**
```json
{
  "from": "sender@example.com",
  "to": "abhinav.allam@abhinavall.net",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<html>...</html>",
  "headers": {
    "message-id": "<abc@example.com>",
    "date": "2025-10-07T20:00:00Z",
    "received-spf": "pass",
    "dkim-signature": "..."
  },
  "rawSize": 1024
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email processed successfully",
  "metadata": {
    "receivedAt": "2025-10-07T20:00:01.123Z",
    "sender": {
      "address": "sender@example.com",
      "domain": "example.com"
    },
    "security": {
      "spf": "pass",
      "dkim": "present",
      "dmarc": "pass"
    }
  }
}
```

### POST /api/email/test
Test endpoint for development.

**Request Body:**
```json
{
  "from": "test@example.com",
  "subject": "Test Email",
  "text": "Test content"
}
```

### GET /api/email/stats
Get email system statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "emailAddress": "abhinav.allam@abhinavall.net",
    "forwardTo": "abhinavall0123@gmail.com",
    "processorStatus": "active",
    "version": "1.0.0"
  }
}
```

## File Structure

```
personal_portfolio/
├── api/
│   ├── server.js                  # Main Express server
│   ├── config/
│   │   └── env.js                 # Configuration
│   ├── middleware/
│   │   └── rateLimiter.js         # Rate limiting
│   ├── endpoints/
│   │   └── email.js               # Email API routes
│   └── email/
│       ├── processor.js           # Core email processing
│       └── utils.js               # Email utilities
├── CLOUDFLARE_EMAIL_SETUP.md      # Setup guide
├── GMAIL_SEND_AS_SETUP.md         # Gmail configuration
└── EMAIL_ARCHITECTURE.md          # This file
```

## Security Considerations

### Inbound Email Security
- **Cloudflare spam filtering**: Automatic
- **SPF/DKIM/DMARC**: Checked and logged
- **Rate limiting**: API endpoints protected
- **HTTPS only**: All webhook traffic encrypted
- **No direct exposure**: Home network never exposed

### Outbound Email Security
- **Domain verification**: Required by SMTP relay
- **DKIM signing**: Automatic via SendGrid
- **API key auth**: No password storage
- **TLS encryption**: All SMTP traffic encrypted

### Data Privacy
- **Local processing**: Emails processed on your linuxbox
- **No cloud storage**: Metadata logged locally only
- **Encrypted transit**: All traffic via Cloudflare Tunnel
- **Access control**: Only you have access to logs

## Monitoring & Logging

### Linuxbox Logs
```bash
# Real-time email processing logs
sudo journalctl -u abhinav-portfolio.service -f

# Filter email-specific logs
sudo journalctl -u abhinav-portfolio.service -f | grep "Email Received"

# Last 100 email logs
sudo journalctl -u abhinav-portfolio.service | grep "Email Received" | tail -100
```

### Cloudflare Logs
- Worker logs: Cloudflare Dashboard > Workers & Pages > email-processor > Logs
- Email routing: Cloudflare Dashboard > Email > Activity

### SendGrid Logs (for sending)
- Dashboard: https://app.sendgrid.com/
- Email Activity: Track delivery, opens, clicks
- Alerts: Set up for bounces or spam reports

## Maintenance

### Regular Tasks
- **Weekly**: Check email logs for errors
- **Monthly**: Review spam/bounce rates in SendGrid
- **Quarterly**: Rotate SMTP API keys
- **As needed**: Update Cloudflare Worker code

### Updates
```bash
# Update linuxbox code
cd /home/abhinav/personal_portfolio
git pull origin main
npm install
sudo systemctl restart abhinav-portfolio.service

# Update Cloudflare Worker
# Edit in dashboard or use wrangler CLI
```

## Future Enhancements

### Phase 1: Current (Basic Receiving)
- [x] Cloudflare Email Routing
- [x] Email Worker webhook
- [x] Linuxbox processing
- [x] Metadata extraction
- [x] Gmail forwarding

### Phase 2: Enhanced Monitoring
- [ ] Email analytics dashboard (web UI)
- [ ] Sender statistics (domains, volume)
- [ ] Email search interface
- [ ] Storage of email metadata in SQLite

### Phase 3: Advanced Features
- [ ] Auto-responder system
- [ ] Custom filtering rules
- [ ] Email templates
- [ ] Scheduled sending
- [ ] Integration with portfolio contact form

### Phase 4: Full Email Client
- [ ] Web-based email reader
- [ ] Compose interface
- [ ] Folder management
- [ ] Attachment handling
- [ ] Mobile responsive

## Cost Analysis

### Current Setup (Free Tier)
- Cloudflare Email Routing: **$0** (unlimited)
- Cloudflare Tunnel: **$0** (included)
- SendGrid Free: **$0** (100 emails/day)
- Linuxbox hosting: **$0** (self-hosted)
- **Total: $0/month**

### If Scaling Up
- SendGrid Essentials: **$19.95/month** (50k emails)
- Cloudflare still free
- Linuxbox still free
- **Total: $19.95/month**

### Commercial Email Comparison
- Google Workspace: $6/user/month ($72/year)
- Microsoft 365: $6/user/month ($72/year)
- **Your setup: $0-20/month** (much better!)

---

Your custom email system is now complete and professional-grade!

