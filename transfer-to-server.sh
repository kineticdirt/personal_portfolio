#!/bin/bash

# Portfolio Transfer Script for Linux Server
# This script helps transfer the portfolio to a remote Linux server

set -e

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

# Function to show usage
show_usage() {
    echo "Portfolio Transfer Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --host HOST        SSH host (required)"
    echo "  -u, --user USER        SSH username (default: ubuntu)"
    echo "  -p, --port PORT        SSH port (default: 22)"
    echo "  -k, --key KEYFILE      SSH private key file"
    echo "  -d, --dest DEST        Destination directory (default: ~/personal_portfolio)"
    echo "  --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -h 192.168.1.100 -u ubuntu"
    echo "  $0 -h myserver.com -u root -p 2222 -k ~/.ssh/id_rsa"
    echo "  $0 -h server.com -d /opt/portfolio"
}

# Default values
SSH_HOST=""
SSH_USER="ubuntu"
SSH_PORT="22"
SSH_KEY=""
DEST_DIR="~/personal_portfolio"
LOCAL_DIR="."

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            SSH_HOST="$2"
            shift 2
            ;;
        -u|--user)
            SSH_USER="$2"
            shift 2
            ;;
        -p|--port)
            SSH_PORT="$2"
            shift 2
            ;;
        -k|--key)
            SSH_KEY="$2"
            shift 2
            ;;
        -d|--dest)
            DEST_DIR="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [ -z "$SSH_HOST" ]; then
    print_error "SSH host is required!"
    show_usage
    exit 1
fi

# Build SSH command
SSH_CMD="ssh -p $SSH_PORT"
if [ -n "$SSH_KEY" ]; then
    SSH_CMD="$SSH_CMD -i $SSH_KEY"
fi
SSH_CMD="$SSH_CMD $SSH_USER@$SSH_HOST"

SCP_CMD="scp -P $SSH_PORT"
if [ -n "$SSH_KEY" ]; then
    SCP_CMD="$SCP_CMD -i $SSH_KEY"
fi

print_status "🚀 Starting portfolio transfer to $SSH_USER@$SSH_HOST:$DEST_DIR"

# Test SSH connection
print_status "Testing SSH connection..."
if ! $SSH_CMD "echo 'SSH connection successful'" > /dev/null 2>&1; then
    print_error "SSH connection failed! Please check your credentials and network."
    exit 1
fi
print_success "SSH connection successful"

# Create destination directory
print_status "Creating destination directory..."
$SSH_CMD "mkdir -p $DEST_DIR"

# Transfer files using rsync (if available) or scp
print_status "Transferring portfolio files..."

# Check if rsync is available
if command -v rsync &> /dev/null; then
    print_status "Using rsync for efficient transfer..."
    RSYNC_CMD="rsync -avz -e 'ssh -p $SSH_PORT"
    if [ -n "$SSH_KEY" ]; then
        RSYNC_CMD="$RSYNC_CMD -i $SSH_KEY"
    fi
    RSYNC_CMD="$RSYNC_CMD' --exclude='node_modules' --exclude='.git' --exclude='coverage' $LOCAL_DIR/ $SSH_USER@$SSH_HOST:$DEST_DIR/"
    
    eval $RSYNC_CMD
else
    print_status "Using scp for file transfer..."
    # Create tar archive
    print_status "Creating archive..."
    tar -czf portfolio.tar.gz --exclude='node_modules' --exclude='.git' --exclude='coverage' .
    
    # Transfer archive
    print_status "Transferring archive..."
    $SCP_CMD portfolio.tar.gz $SSH_USER@$SSH_HOST:$DEST_DIR/
    
    # Extract on remote server
    print_status "Extracting files on remote server..."
    $SSH_CMD "cd $DEST_DIR && tar -xzf portfolio.tar.gz && rm portfolio.tar.gz"
    
    # Clean up local archive
    rm portfolio.tar.gz
fi

print_success "Files transferred successfully"

# Make scripts executable on remote server
print_status "Setting up permissions..."
$SSH_CMD "cd $DEST_DIR && chmod +x *.sh"

# Install dependencies on remote server
print_status "Installing dependencies on remote server..."
$SSH_CMD "cd $DEST_DIR && ./install-dependencies.sh"

print_success "🎉 Portfolio transfer completed successfully!"
echo ""
print_status "Next steps on your Linux server:"
echo "1. Set up Cloudflare tunnel credentials:"
echo "   - Go to Cloudflare Dashboard > Zero Trust > Access > Tunnels"
echo "   - Create tunnel 'abhinav-portfolio-tunnel'"
echo "   - Download credentials to ~/.cloudflared/abhinav-portfolio-tunnel.json"
echo ""
echo "2. Run the setup script:"
echo "   ssh $SSH_USER@$SSH_HOST"
echo "   cd $DEST_DIR"
echo "   ./setup-cloudflare-tunnel.sh"
echo ""
print_status "Your portfolio will be accessible at: https://portfolio.abhinavallam.com"

