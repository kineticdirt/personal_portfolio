# Gmail "Send As" Setup Guide

Configure Gmail to send emails from `abhinav.allam@abhinavall.net` address.

## Overview

This setup allows you to:
- Compose emails in Gmail as normal
- Send them appearing to come from `abhinav.allam@abhinavall.net`
- Replies go to your custom domain
- Original Gmail functionality remains intact

## Option 1: Using Cloudflare Email (Recommended)

Cloudflare doesn't provide SMTP for sending, so we'll use a free SMTP relay service.

### Step 1: Sign Up for SMTP Relay Service

Choose one (all have free tiers):

**SendGrid (Recommended)**
- Sign up: https://signup.sendgrid.com/
- Free tier: 100 emails/day
- Verification: Domain verification required

**Mailgun**
- Sign up: https://www.mailgun.com/
- Free tier: 5,000 emails/month
- Verification: Domain verification required

**SMTP2GO**
- Sign up: https://www.smtp2go.com/
- Free tier: 1,000 emails/month
- Verification: Email only

### Step 2: Get SMTP Credentials

After signing up (example with SendGrid):

1. Navigate to **Settings** > **API Keys**
2. Click **Create API Key**
3. Name: `Gmail Send As`
4. Permissions: **Mail Send** (Full Access)
5. Copy the API key (you'll need this)

Your SMTP credentials:
```
SMTP Server: smtp.sendgrid.net
Port: 587 (TLS) or 465 (SSL)
Username: apikey
Password: [Your API Key]
```

### Step 3: Verify Your Domain

Most SMTP services require domain verification:

1. In SendGrid, go to **Settings** > **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Select **Cloudflare** as your DNS provider
4. Follow instructions to add DNS records in Cloudflare:

```
Type: CNAME
Name: s1._domainkey
Content: s1.domainkey.u12345.wl.sendgrid.net

Type: CNAME  
Name: s2._domainkey
Content: s2.domainkey.u12345.wl.sendgrid.net
```

5. Wait for verification (usually 5-10 minutes)

### Step 4: Configure Gmail "Send As"

1. Open Gmail (abhinavall0123@gmail.com)
2. Click the **gear icon** > **See all settings**
3. Go to **Accounts and Import** tab
4. In "Send mail as" section, click **Add another email address**

5. A popup appears:
   - Name: `Abhinav Allam`
   - Email address: `abhinav.allam@abhinavall.net`
   - Uncheck "Treat as an alias"
   - Click **Next Step**

6. SMTP Configuration:
   - SMTP Server: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `[Your SendGrid API Key]`
   - Check "Secured connection using TLS"
   - Click **Add Account**

7. Gmail will send a verification code to `abhinav.allam@abhinavall.net`
8. Check your Gmail (it should be forwarded via Cloudflare)
9. Click the confirmation link or enter the code
10. Done! You can now send from your custom domain

### Step 5: Set as Default (Optional)

1. In "Send mail as" section
2. Click **make default** next to `abhinav.allam@abhinavall.net`
3. All new emails will default to your custom domain

## Option 2: Without SMTP Relay (Limited)

If you don't want to use an SMTP relay, you can:

1. Still set up "Send As" in Gmail
2. Use Gmail's SMTP directly
3. **Limitation**: Emails will show "via gmail.com" to recipients
4. Not recommended for professional use

## Testing Your Setup

### Test 1: Send Email from Gmail
1. Click **Compose** in Gmail
2. Notice the "From" field now shows your custom address
3. Send a test email to yourself
4. Verify it appears to come from `abhinav.allam@abhinavall.net`

### Test 2: Check Headers
1. Open the test email
2. Click three dots > **Show original**
3. Verify headers show:
   ```
   From: Abhinav Allam <abhinav.allam@abhinavall.net>
   Return-Path: abhinav.allam@abhinavall.net
   ```

### Test 3: Reply Test
1. Send email from another account
2. Reply from Gmail using custom domain
3. Verify recipient sees custom domain

## The "Piggyback" System You Requested

Your setup now works like this:

```
Receiving:
Email → Cloudflare → Linuxbox (adds metadata) → Gmail
(You see: enriched email with sender info, metrics, etc.)

Sending:
Gmail → SendGrid SMTP → Recipient
(Recipient sees: email from abhinav.allam@abhinavall.net)
```

### What You Get:

**Receiving:**
- All emails to custom domain forwarded to Gmail
- Metadata added: sender domain, security checks, timestamps
- Logs stored on linuxbox for analytics
- No spam (Cloudflare filters it)

**Sending:**
- Compose in familiar Gmail interface
- Appears professional (from custom domain)
- No "via gmail.com" warning
- Delivery tracking via SendGrid

## Advanced: Automatic Forwarding Rules

### Forward Based on Sender Domain

In Gmail, create filters:

1. Click **Search** > **Show search options**
2. From: `*@github.com`
3. Click **Create filter**
4. Action: **Apply label: "GitHub"**, **Forward to: [another address]**
5. Save

### Add Custom Metadata in Subject

You can modify the Cloudflare Worker to add info to subject:

```javascript
// In email-processor worker
const subjectPrefix = `[From: ${senderDomain}] `;
emailData.subject = subjectPrefix + emailData.subject;
```

## Monitoring Email Delivery

### SendGrid Dashboard
- Track sent emails
- See open rates (if enabled)
- Monitor deliverability
- Check bounces and spam reports

### Linuxbox Logs
```bash
# See received emails
sudo journalctl -u abhinav-portfolio.service -f | grep "Email Received"

# Check email stats
curl http://localhost:3000/api/email/stats
```

## Cost Breakdown

**Free Tier Limits:**
- SendGrid: 100 emails/day
- Mailgun: 5,000 emails/month  
- SMTP2GO: 1,000 emails/month
- Cloudflare Email Routing: Unlimited

**If you exceed free tier:**
- SendGrid: $19.95/month for 50k emails
- Mailgun: $35/month for 50k emails
- Most people stay in free tier

## Troubleshooting

### "Send As" Verification Email Not Arriving
1. Check Gmail spam folder
2. Check Cloudflare Email Routing dashboard
3. Send test via: `curl -X POST http://localhost:3000/api/email/test`
4. Wait 5-10 minutes (email can be slow)

### Emails Marked as Spam
1. Verify SPF/DKIM records in Cloudflare
2. Verify domain in SendGrid
3. Start with small volume (don't send 100 emails immediately)
4. Avoid spam trigger words

### SMTP Authentication Failed
1. Double-check API key (no extra spaces)
2. Verify username is exactly `apikey`
3. Ensure port 587 is not blocked
4. Try port 465 (SSL) instead

## Security Best Practices

1. **Never share SMTP credentials**
2. **Use API keys, not passwords** (can be revoked)
3. **Enable 2FA on SendGrid account**
4. **Monitor sending activity** for unauthorized use
5. **Rotate API keys** every 6 months

## Next Steps

1. Set up email signature in Gmail
2. Create email templates for common responses
3. Set up automatic forwarding rules
4. Add custom labels for organization
5. Consider adding calendar integration

---

You can now send and receive emails as `abhinav.allam@abhinavall.net` with full Gmail functionality!

