# Cloudflare Email Routing Setup Guide

Complete guide to set up email receiving at `abhinav.allam@abhinavall.net` with metadata processing.

## Architecture Overview

```
Email Sent to abhinav.allam@abhinavall.net
           ↓
Cloudflare Email Routing (receives email)
           ↓
Cloudflare Email Worker (processes & extracts metadata)
           ↓
Webhook to Linuxbox API (http://localhost:3000/api/email/incoming)
           ↓
Email Processor adds metadata & logs
           ↓
Forwards to abhinavall0123@gmail.com with enriched metadata
```

## Part 1: Enable Cloudflare Email Routing

### Step 1: Access Cloudflare Dashboard
1. Log in to https://dash.cloudflare.com
2. Select your domain: **abhinavall.net**
3. Navigate to **Email** in the left sidebar

### Step 2: Enable Email Routing
1. Click **Get started** or **Enable Email Routing**
2. Cloudflare will automatically configure the necessary DNS records:
   - MX records for email delivery
   - SPF records for authentication
   - TXT records for verification

### Step 3: Create Email Address
1. In the **Destination addresses** section:
   - Add your Gmail: `abhinavall0123@gmail.com`
   - Verify it by clicking the link sent to Gmail

2. In the **Routing rules** section:
   - Create a custom address: `abhinav.allam@abhinavall.net`
   - Set action: **Send to a Worker** (we'll create this next)

## Part 2: Create Cloudflare Email Worker

### Step 1: Create Worker
1. Go to **Workers & Pages** in Cloudflare Dashboard
2. Click **Create application**
3. Select **Create Worker**
4. Name it: `email-processor`

### Step 2: Add Worker Code

Replace the default worker code with:

```javascript
export default {
  async email(message, env, ctx) {
    try {
      // Extract email data
      const emailData = {
        from: message.from,
        to: message.to,
        subject: message.headers.get('subject'),
        date: message.headers.get('date'),
        messageId: message.headers.get('message-id'),
        headers: {},
        rawSize: message.size || 0
      };
      
      // Extract important headers
      const headerKeys = [
        'from', 'to', 'subject', 'date', 'message-id',
        'return-path', 'reply-to', 'content-type',
        'received-spf', 'dkim-signature'
      ];
      
      headerKeys.forEach(key => {
        const value = message.headers.get(key);
        if (value) {
          emailData.headers[key] = value;
        }
      });
      
      // Get email content
      const rawEmail = await new Response(message.raw).text();
      emailData.text = await message.text();
      
      // Try to get HTML if available
      try {
        const html = await message.html();
        if (html) {
          emailData.html = html;
        }
      } catch (e) {
        // HTML not available, that's okay
      }
      
      // Send to linuxbox webhook
      const webhookUrl = 'https://portfolio.abhinavall.net/api/email/incoming';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        console.log('Email forwarded to linuxbox successfully');
        
        // Also forward directly to Gmail as backup
        await message.forward('abhinavall0123@gmail.com');
      } else {
        console.error('Failed to forward to linuxbox:', response.status);
        // Still forward to Gmail
        await message.forward('abhinavall0123@gmail.com');
      }
      
    } catch (error) {
      console.error('Email processing error:', error);
      // Forward to Gmail as fallback
      await message.forward('abhinavall0123@gmail.com');
    }
  }
}
```

### Step 3: Deploy Worker
1. Click **Save and Deploy**
2. Copy the worker URL (you'll need it later)

## Part 3: Connect Worker to Email Routing

### Step 1: Link Worker to Email Route
1. Go back to **Email** > **Email Routing**
2. In **Routing rules**, edit the rule for `abhinav.allam@abhinavall.net`
3. Change action to: **Send to a Worker**
4. Select your worker: `email-processor`
5. Save

### Step 2: Configure Catch-All (Optional)
1. Create a catch-all rule: `*@abhinavall.net`
2. Action: Send to worker or forward to Gmail
3. This catches any email sent to your domain

## Part 4: DNS Verification

Cloudflare should have automatically added these records. Verify in **DNS** section:

### MX Records (Mail Exchange)
```
Type: MX
Name: @
Priority: 1
Content: route1.mx.cloudflare.net

Type: MX
Name: @
Priority: 2
Content: route2.mx.cloudflare.net

Type: MX
Name: @
Priority: 3
Content: route3.mx.cloudflare.net
```

### SPF Record (Sender Policy Framework)
```
Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all
```

## Part 5: Test Your Setup

### Test 1: Basic Email Test
1. Send an email to: `abhinav.allam@abhinavall.net`
2. Check Gmail for the forwarded email
3. Check linuxbox logs: `sudo journalctl -u abhinav-portfolio.service -f`
4. You should see the metadata extraction in logs

### Test 2: API Test Endpoint
```bash
# From your linuxbox
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test"
  }'
```

### Test 3: Check Email Stats
```bash
curl http://localhost:3000/api/email/stats
```

## Part 6: View Logs and Monitor

### Check Linuxbox Email Processing
```bash
# Real-time logs
sudo journalctl -u abhinav-portfolio.service -f

# Last 50 lines
sudo journalctl -u abhinav-portfolio.service -n 50
```

### Check Cloudflare Worker Logs
1. Go to Workers & Pages
2. Select your `email-processor` worker
3. Click **Logs** tab
4. See real-time email processing

## Expected Email Format in Gmail

When you receive an email, it will look like:

```
From: sender@example.com (via abhinav.allam@abhinavall.net)
Subject: [Forwarded] Original Subject

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email Metadata (Processed by Linuxbox)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Received: 2025-10-07T20:30:00.000Z
From: sender@example.com
Domain: example.com
Original To: abhinav.allam@abhinavall.net

Message Size: 1024 bytes
Attachments: 0

Security Checks:
  SPF: pass
  DKIM: present
  DMARC: pass

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Original Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Original email content here]
```

## Troubleshooting

### Email Not Arriving
1. Check Cloudflare Email Routing dashboard for delivery status
2. Verify MX records are correct
3. Check worker logs for errors
4. Verify Gmail hasn't marked it as spam

### Webhook Not Receiving
1. Ensure Cloudflare tunnel is running: `sudo systemctl status cloudflared-tunnel.service`
2. Verify linuxbox server is running: `sudo systemctl status abhinav-portfolio.service`
3. Test webhook manually with curl
4. Check firewall isn't blocking Cloudflare

### Worker Errors
1. Check worker logs in Cloudflare dashboard
2. Verify webhook URL is correct
3. Test with API test endpoint first

## Security Notes

- Emails are processed locally on your linuxbox
- Cloudflare handles spam filtering automatically
- SPF/DKIM/DMARC records are managed by Cloudflare
- No ports exposed on your home network
- All email data remains private

## Next Steps

After email receiving works:

1. **Set up Gmail "Send As"** - See GMAIL_SEND_AS_SETUP.md
2. **Add SMTP relay** for programmatic sending (SendGrid/Mailgun)
3. **Build web interface** to view email logs and stats
4. **Add filtering rules** in Cloudflare Email Routing

---

Your email address `abhinav.allam@abhinavall.net` is now ready to receive emails with full metadata processing!

