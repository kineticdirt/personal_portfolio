#!/bin/bash

# Dependency Installation Script for Abhinav's Portfolio
# This script installs all required dependencies on a fresh Linux system

set -e

echo "🔧 Installing dependencies for Abhinav's Portfolio..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Update package lists
print_status "Updating package lists..."
sudo apt update

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed: $(node --version)"
else
    print_success "Node.js already installed: $(node --version)"
fi

# Install npm if not present
if ! command -v npm &> /dev/null; then
    print_status "Installing npm..."
    sudo apt-get install -y npm
    print_success "npm installed: $(npm --version)"
else
    print_success "npm already installed: $(npm --version)"
fi

# Install cloudflared
print_status "Installing cloudflared..."
if ! command -v cloudflared &> /dev/null; then
    wget -O cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared.deb
    rm cloudflared.deb
    print_success "cloudflared installed: $(cloudflared --version)"
else
    print_success "cloudflared already installed: $(cloudflared --version)"
fi

# Install project dependencies
print_status "Installing project dependencies..."
if [ -f package.json ]; then
    npm install
    print_success "Project dependencies installed"
else
    print_warning "package.json not found. Make sure you're in the project directory."
fi

# Install additional useful tools
print_status "Installing additional useful tools..."
sudo apt install -y htop nano vim ufw fail2ban

# Configure firewall (basic security)
print_status "Configuring basic firewall rules..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
print_success "Firewall configured"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p ~/.cloudflared
mkdir -p ~/logs
print_success "Directories created"

# Set up log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/abhinav-portfolio > /dev/null <<EOF
/var/log/abhinav-portfolio/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

print_success "Log rotation configured"

# Display completion message
echo ""
print_success "🎉 Dependency installation completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Clone your repository: git clone <your-repo-url>"
echo "2. Navigate to the project directory"
echo "3. Run the setup script: ./setup-cloudflare-tunnel.sh"
echo "4. Or use the deploy script: ./deploy.sh install"
echo ""
print_status "Installed versions:"
echo "  • Node.js: $(node --version)"
echo "  • npm: $(npm --version)"
echo "  • cloudflared: $(cloudflared --version)"
echo "  • Git: $(git --version)"
echo ""
print_warning "Remember to configure your Cloudflare tunnel credentials before running the setup!"
