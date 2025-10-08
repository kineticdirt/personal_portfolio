#!/bin/bash

# Quick Deploy Script for Abhinav's Portfolio
# This script handles quick deployment and updates

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
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     - Start the portfolio and tunnel services"
    echo "  stop      - Stop the portfolio and tunnel services"
    echo "  restart   - Restart the portfolio and tunnel services"
    echo "  status    - Show status of all services"
    echo "  logs      - Show logs for all services"
    echo "  update    - Pull latest changes and restart services"
    echo "  install   - Run the full setup script"
    echo ""
}

# Function to start services
start_services() {
    print_status "Starting portfolio and tunnel services..."
    sudo systemctl start abhinav-portfolio.service
    sudo systemctl start cloudflared-tunnel.service
    print_success "Services started successfully"
}

# Function to stop services
stop_services() {
    print_status "Stopping portfolio and tunnel services..."
    sudo systemctl stop cloudflared-tunnel.service
    sudo systemctl stop abhinav-portfolio.service
    print_success "Services stopped successfully"
}

# Function to restart services
restart_services() {
    print_status "Restarting portfolio and tunnel services..."
    sudo systemctl restart abhinav-portfolio.service
    sudo systemctl restart cloudflared-tunnel.service
    print_success "Services restarted successfully"
}

# Function to show status
show_status() {
    print_status "Portfolio Service Status:"
    sudo systemctl status abhinav-portfolio.service --no-pager -l
    
    echo ""
    print_status "Tunnel Service Status:"
    sudo systemctl status cloudflared-tunnel.service --no-pager -l
}

# Function to show logs
show_logs() {
    print_status "Portfolio Service Logs (last 20 lines):"
    sudo journalctl -u abhinav-portfolio.service --no-pager -l -n 20
    
    echo ""
    print_status "Tunnel Service Logs (last 20 lines):"
    sudo journalctl -u cloudflared-tunnel.service --no-pager -l -n 20
}

# Function to update and restart
update_services() {
    print_status "Pulling latest changes from repository..."
    git pull origin main
    
    print_status "Installing/updating dependencies..."
    npm install
    
    print_status "Restarting services..."
    restart_services
    
    print_success "Update completed successfully"
}

# Function to run full installation
run_installation() {
    print_status "Running full installation..."
    chmod +x setup-cloudflare-tunnel.sh
    ./setup-cloudflare-tunnel.sh
}

# Main script logic
case "${1:-}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    update)
        update_services
        ;;
    install)
        run_installation
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
