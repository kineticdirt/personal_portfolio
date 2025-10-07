# Abhinav Allam - Portfolio

Modern, responsive personal portfolio website showcasing AI/ML projects, software engineering skills, and professional experience. Built with vanilla HTML, CSS, and JavaScript.

## Live Deployments

**Static Site (GitHub Pages)**: https://kineticdirt.github.io/personal_portfolio/
**Dynamic Site (Cloudflare Tunnel)**: https://portfolio.abhinavall.net

## Architecture

### Two Deployment Configurations

**1. Static Site (gh-pages branch)**
- Pure static HTML/CSS/JS
- Deployed to GitHub Pages
- No server-side processing
- Ideal for simple portfolio viewing

**2. Dynamic Site (main branch)**
- Express.js server with API endpoints
- Deployed via Cloudflare Tunnel
- Contact form processing
- Analytics tracking
- Server-side capabilities

## Tech Stack

**Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
**Backend**: Express.js, Node.js
**Deployment**: GitHub Pages (static), Cloudflare Tunnel (dynamic)
**Testing**: Jest, jsdom
**Linting**: ESLint, Stylelint, Prettier

## Quick Start

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

```bash
git clone https://github.com/kineticdirt/personal_portfolio.git
cd personal_portfolio
npm install
```

### Development

```bash
# Static development (live-server)
npm run dev

# Dynamic development with API server (Express + nodemon)
npm run dev:api
```

### Available Scripts

```bash
# Development
npm run dev          # Start static dev server (live-server)
npm run dev:api      # Start API server with hot reload (nodemon)
npm start            # Start production API server
npm start:static     # Alias for npm run dev

# Building
npm run build        # Run linting, tests, and optimization
npm run optimize     # Minify CSS and JS
npm run preview      # Preview production build

# Quality Assurance
npm run lint         # Run ESLint
npm run lint:css     # Run Stylelint
npm run test         # Run tests with coverage
npm run test:watch   # Run tests in watch mode
npm run validate     # Run all quality checks

# Deployment
npm run deploy:gh-pages  # Merge main to gh-pages and deploy
npm run clean            # Clean build artifacts

# Cloudflare Tunnel Management
npm run tunnel:setup     # Full tunnel setup
npm run tunnel:start     # Start services
npm run tunnel:stop      # Stop services
npm run tunnel:restart   # Restart services
npm run tunnel:status    # Check service status
npm run tunnel:logs      # View service logs
npm run tunnel:update    # Pull updates and restart
npm run install:deps     # Install system dependencies
```

## Project Structure

```
personal_portfolio/
├── .github/
│   └── workflows/           # CI/CD for GitHub Pages
├── __tests__/              # Test files
├── api/
│   ├── config/             # API configuration
│   ├── endpoints/          # API endpoint modules
│   ├── middleware/         # Express middleware
│   └── server.js           # Express server entry point
├── assets/
│   └── images/             # Image files
├── index.html              # Main HTML file
├── styles.css              # Main CSS file
├── script.js               # Client-side JavaScript
├── cloudflare-tunnel.yml   # Cloudflare tunnel config
├── deploy.sh               # Service management script
├── setup-cloudflare-tunnel.sh  # Full setup script
└── package.json            # Dependencies and scripts
```

## Static Site Deployment (GitHub Pages)

The static site automatically deploys when you push to the `gh-pages` branch:

```bash
# Method 1: Merge main to gh-pages
npm run deploy:gh-pages

# Method 2: Manual merge
git checkout gh-pages
git merge main --no-edit
git push origin gh-pages
git checkout main
```

## Dynamic Site Deployment (Cloudflare Tunnel)

### Prerequisites

- Linux server (Debian/Ubuntu)
- Cloudflare account with Zero Trust enabled
- Domain (abhinavall.net) configured with Cloudflare DNS

### Setup Steps

1. **Clone repository on server:**
   ```bash
   git clone https://github.com/kineticdirt/personal_portfolio.git
   cd personal_portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm run install:deps
   ```

3. **Set up Cloudflare tunnel:**
   - Go to Cloudflare Dashboard > Zero Trust > Access > Tunnels
   - Create a new tunnel named `abhinav-portfolio-tunnel`
   - Download the credentials file and save it as `~/.cloudflared/abhinav-portfolio-tunnel.json`
   - Configure the tunnel with hostname: `portfolio.abhinavall.net`

4. **Run the setup script:**
   ```bash
   npm run tunnel:setup
   ```

### Service Management

The setup creates two systemd services:
- `abhinav-portfolio.service` - Express server on port 3000
- `cloudflared-tunnel.service` - Cloudflare tunnel

```bash
# Check service status
sudo systemctl status abhinav-portfolio.service
sudo systemctl status cloudflared-tunnel.service

# View logs
sudo journalctl -u abhinav-portfolio.service -f
sudo journalctl -u cloudflared-tunnel.service -f

# Restart services
sudo systemctl restart abhinav-portfolio.service
sudo systemctl restart cloudflared-tunnel.service
```

### Quick Management Commands

```bash
./deploy.sh start      # Start services
./deploy.sh stop       # Stop services
./deploy.sh restart    # Restart services
./deploy.sh status     # Check status
./deploy.sh logs       # View logs
./deploy.sh update     # Pull updates and restart
```

## API Endpoints

The dynamic site includes the following API endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission
- `POST /api/analytics` - Analytics event tracking

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run tests in watch mode
npm run test:watch
```

## Configuration

Create a `.env` file for environment-specific configuration:

```bash
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://portfolio.abhinavall.net
```

## License

MIT License

## Author

**Abhinav Allam**
- Email: abhinav.allam@abhinavall.net
- GitHub: @kineticdirt
- Portfolio: https://abhinavall.net
