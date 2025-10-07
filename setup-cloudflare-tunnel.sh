#!/bin/bash

# Cloudflare Tunnel Setup Script for Abhinav's Portfolio
# This script sets up Cloudflare tunnel for remote access to the portfolio

set -e

echo "🚀 Setting up Cloudflare Tunnel for Abhinav's Portfolio..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_success "Node.js is already installed: $(node --version)"
fi

# Install npm dependencies
print_status "Installing npm dependencies..."
npm install

# Install cloudflared
print_status "Installing cloudflared..."
if ! command -v cloudflared &> /dev/null; then
    wget -O cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared.deb
    rm cloudflared.deb
    print_success "cloudflared installed successfully"
else
    print_success "cloudflared is already installed: $(cloudflared --version)"
fi

# Create cloudflared directory
print_status "Setting up cloudflared configuration..."
mkdir -p ~/.cloudflared

# Check if tunnel credentials exist
if [ ! -f ~/.cloudflared/abhinav-portfolio-tunnel.json ]; then
    print_warning "Tunnel credentials file not found!"
    print_status "You need to create a tunnel and download the credentials file:"
    print_status "1. Go to Cloudflare Dashboard > Zero Trust > Access > Tunnels"
    print_status "2. Create a new tunnel named 'abhinav-portfolio-tunnel'"
    print_status "3. Download the credentials file and save it as ~/.cloudflared/abhinav-portfolio-tunnel.json"
    print_status "4. Configure the tunnel with hostname: portfolio.abhinavall.net"
    print_status "5. Run this script again"
    exit 1
fi

# Copy tunnel configuration
cp cloudflare-tunnel.yml ~/.cloudflared/config.yml
print_success "Tunnel configuration copied to ~/.cloudflared/config.yml"

# Create systemd service for the portfolio
print_status "Creating systemd service for the portfolio..."
sudo tee /etc/systemd/system/abhinav-portfolio.service > /dev/null <<EOF
[Unit]
Description=Abhinav's Portfolio Website with API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for cloudflared tunnel
print_status "Creating systemd service for cloudflared tunnel..."
sudo tee /etc/systemd/system/cloudflared-tunnel.service > /dev/null <<EOF
[Unit]
Description=Cloudflare Tunnel for Abhinav's Portfolio
After=network.target abhinav-portfolio.service
Requires=abhinav-portfolio.service

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/cloudflared tunnel --config ~/.cloudflared/config.yml run
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable services
print_status "Enabling and starting services..."
sudo systemctl daemon-reload
sudo systemctl enable abhinav-portfolio.service
sudo systemctl enable cloudflared-tunnel.service

# Start services
sudo systemctl start abhinav-portfolio.service
sudo systemctl start cloudflared-tunnel.service

# Check service status
print_status "Checking service status..."
sleep 5

if systemctl is-active --quiet abhinav-portfolio.service; then
    print_success "Portfolio service is running"
else
    print_error "Portfolio service failed to start"
    sudo systemctl status abhinav-portfolio.service
fi

if systemctl is-active --quiet cloudflared-tunnel.service; then
    print_success "Cloudflare tunnel service is running"
else
    print_error "Cloudflare tunnel service failed to start"
    sudo systemctl status cloudflared-tunnel.service
fi

# Display useful information
echo ""
print_success "🎉 Setup completed successfully!"
echo ""
print_status "Useful commands:"
echo "  • Check portfolio status: sudo systemctl status abhinav-portfolio.service"
echo "  • Check tunnel status: sudo systemctl status cloudflared-tunnel.service"
echo "  • View portfolio logs: sudo journalctl -u abhinav-portfolio.service -f"
echo "  • View tunnel logs: sudo journalctl -u cloudflared-tunnel.service -f"
echo "  • Restart portfolio: sudo systemctl restart abhinav-portfolio.service"
echo "  • Restart tunnel: sudo systemctl restart cloudflared-tunnel.service"
echo ""
print_status "Your portfolio should be accessible at: https://portfolio.abhinavall.net"
echo ""
print_warning "Make sure your domain DNS is pointing to Cloudflare and the tunnel is properly configured in the Cloudflare dashboard!"
