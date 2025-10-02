# 🚀 Portfolio Deployment Guide - Windows to Linux Server

## Quick Transfer Options

### Option 1: Automated Transfer (Recommended)

**For Windows users:**
```cmd
# Run the batch script
transfer-to-server.bat
```

**For Git Bash/Linux users:**
```bash
# Make executable and run
chmod +x transfer-to-server.sh
./transfer-to-server.sh -h YOUR_SERVER_IP -u YOUR_USERNAME
```

### Option 2: Manual Transfer

#### Step 1: Prepare Files
```bash
# Create archive (exclude unnecessary files)
tar -czf portfolio.tar.gz --exclude=node_modules --exclude=.git --exclude=coverage .
```

#### Step 2: Transfer to Server
```bash
# Using SCP
scp -P 22 portfolio.tar.gz username@server_ip:~/personal_portfolio/

# Using SSH with key
scp -P 22 -i ~/.ssh/id_rsa portfolio.tar.gz username@server_ip:~/personal_portfolio/
```

#### Step 3: Extract on Server
```bash
# SSH into server
ssh username@server_ip

# Navigate and extract
cd ~/personal_portfolio
tar -xzf portfolio.tar.gz
rm portfolio.tar.gz
chmod +x *.sh
```

## 🐧 Linux Server Setup

### Prerequisites
- Ubuntu/Debian Linux server
- SSH access
- Cloudflare account with Zero Trust enabled
- Domain configured with Cloudflare DNS

### Step 1: Install Dependencies
```bash
cd ~/personal_portfolio
./install-dependencies.sh
```

### Step 2: Set Up Cloudflare Tunnel

#### 2.1 Create Tunnel in Cloudflare Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Zero Trust** → **Access** → **Tunnels**
3. Click **Create a tunnel**
4. Name: `abhinav-portfolio-tunnel`
5. Click **Save tunnel**

#### 2.2 Download Credentials
1. Click on your tunnel name
2. Go to **Configure** tab
3. Click **Download credentials file**
4. Save as `abhinav-portfolio-tunnel.json`
5. Upload to server: `~/.cloudflared/abhinav-portfolio-tunnel.json`

#### 2.3 Configure Public Hostname
1. In tunnel configuration, click **Public hostname**
2. Add hostname: `portfolio.abhinavallam.com` (or your domain)
3. Service: `http://localhost:3000`
4. Click **Save hostname**

#### 2.4 Configure DNS
1. Go to **DNS** → **Records**
2. Add CNAME record:
   - Name: `portfolio`
   - Target: `abhinav-portfolio-tunnel.cfargotunnel.com`
   - Proxy: ✅ (Orange cloud)

### Step 3: Run Setup Script
```bash
cd ~/personal_portfolio
./setup-cloudflare-tunnel.sh
```

### Step 4: Verify Deployment
```bash
# Check service status
./deploy.sh status

# View logs
./deploy.sh logs

# Test locally
curl http://localhost:3000
```

## 🔧 Service Management

### Available Commands
```bash
# Service control
./deploy.sh start      # Start services
./deploy.sh stop       # Stop services
./deploy.sh restart    # Restart services
./deploy.sh status     # Check status
./deploy.sh logs       # View logs
./deploy.sh update     # Pull updates and restart

# Manual systemctl commands
sudo systemctl status abhinav-portfolio.service
sudo systemctl status cloudflared-tunnel.service
sudo journalctl -u abhinav-portfolio.service -f
sudo journalctl -u cloudflared-tunnel.service -f
```

### Troubleshooting

#### Service Won't Start
```bash
# Check service status
sudo systemctl status abhinav-portfolio.service
sudo systemctl status cloudflared-tunnel.service

# View detailed logs
sudo journalctl -u abhinav-portfolio.service --no-pager -l
sudo journalctl -u cloudflared-tunnel.service --no-pager -l

# Restart services
sudo systemctl restart abhinav-portfolio.service
sudo systemctl restart cloudflared-tunnel.service
```

#### Tunnel Connection Issues
```bash
# Test tunnel manually
cloudflared tunnel --config ~/.cloudflared/config.yml run

# Check credentials file
ls -la ~/.cloudflared/abhinav-portfolio-tunnel.json

# Verify DNS resolution
nslookup portfolio.abhinavallam.com
```

#### Port Issues
```bash
# Check if port 3000 is in use
sudo netstat -tlnp | grep :3000

# Kill process if needed
sudo kill -9 $(sudo lsof -t -i:3000)
```

## 🔒 Security Features

- **Firewall**: UFW configured with SSH, HTTP, HTTPS access
- **Intrusion Prevention**: Fail2ban installed and configured
- **Log Rotation**: Automatic log cleanup
- **Non-root Execution**: Services run as regular user
- **Service Isolation**: Each service runs independently

## 📊 Monitoring

### Log Locations
- Portfolio logs: `sudo journalctl -u abhinav-portfolio.service`
- Tunnel logs: `sudo journalctl -u cloudflared-tunnel.service`
- System logs: `/var/log/syslog`

### Performance Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check network connections
ss -tuln
```

## 🔄 Updates

### Automatic Updates
```bash
# Pull latest changes and restart
./deploy.sh update
```

### Manual Updates
```bash
# Pull changes
git pull origin main

# Install new dependencies
npm install

# Restart services
./deploy.sh restart
```

## 📞 Support

If you encounter issues:
1. Check service status: `./deploy.sh status`
2. View logs: `./deploy.sh logs`
3. Verify Cloudflare tunnel configuration
4. Check DNS settings
5. Ensure firewall allows necessary ports

---

**🎉 Your portfolio should now be accessible at: https://portfolio.abhinavallam.com**

