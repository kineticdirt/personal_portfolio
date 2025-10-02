# 🚀 Abhinav Allam - Modern Portfolio

A modern, responsive personal portfolio website showcasing AI/ML projects, software engineering skills, and professional experience. Built with vanilla HTML, CSS, and JavaScript using contemporary web development practices.

## 🌐 Live Demo

**🔗 [View Live Portfolio](https://kineticdirt.github.io/personal_portfolio/)**

## ✨ Features

- **🎨 Modern Design**: Clean, contemporary UI with smooth animations
- **🌙 Dark Mode**: Toggle between light and dark themes with system preference detection
- **📱 Responsive**: Fully responsive design that works on all devices
- **⚡ Performance**: Optimized for speed with modern web standards
- **♿ Accessible**: WCAG compliant with proper ARIA attributes
- **🔍 SEO Optimized**: Meta tags, semantic HTML, and structured data
- **🧪 Tested**: Comprehensive test suite with Jest
- **🚀 CI/CD**: Automated testing and deployment with GitHub Actions

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties, Modern CSS
- **Icons**: Font Awesome 6
- **Fonts**: Inter (primary), JetBrains Mono (code)
- **Testing**: Jest, jsdom
- **Linting**: ESLint, Stylelint, Prettier
- **Deployment**: GitHub Pages, GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/kineticdirt/personal_portfolio.git
cd personal_portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm start           # Alias for dev

# Building
npm run build       # Build and optimize for production
npm run optimize    # Minify CSS and JS
npm run preview     # Preview production build

# Quality Assurance
npm run lint        # Run ESLint
npm run lint:css    # Run Stylelint
npm run test        # Run tests with coverage
npm run test:watch  # Run tests in watch mode
npm run validate    # Run all quality checks

# Deployment
npm run deploy      # Deploy to GitHub Pages
npm run clean       # Clean build artifacts
```

## 📁 Project Structure

```
personal_portfolio/
├── .github/
│   ├── actions/           # Custom GitHub Actions
│   └── workflows/         # CI/CD workflows
├── __tests__/            # Test files
├── assets/               # Static assets
│   └── images/          # Image files
├── .gitignore
├── index.html           # Main HTML file
├── styles.css           # Modern CSS with custom properties
├── script.js            # ES6+ JavaScript application
├── package.json         # Dependencies and scripts
├── jest.config.js       # Jest configuration
├── jest.setup.js        # Jest setup file
└── README.md           # This file
```

## 🎯 Key Sections

- **🏠 Hero**: Dynamic greeting, code showcase, call-to-action
- **👨‍💻 About**: Personal story, skills overview, statistics
- **🚀 Projects**: Featured projects with tech stacks and links
- **🛠️ Skills**: Categorized skills with proficiency levels
- **📄 Resume**: Downloadable PDF and online preview
- **📧 Contact**: Multiple contact methods and availability status

## 🧪 Testing

The project includes comprehensive tests for:

- JavaScript functionality
- DOM interactions
- Accessibility features
- Performance metrics
- Cross-browser compatibility

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

The site is automatically deployed to GitHub Pages on every push to the main branch via GitHub Actions.

### Manual Deployment

```bash
npm run deploy
```

## 🌐 Cloudflare Tunnel Deployment

For remote access and custom domain deployment, this project includes Cloudflare tunnel setup for Linux servers.

### Prerequisites

- Linux server (Ubuntu/Debian recommended)
- Cloudflare account with Zero Trust enabled
- Domain configured with Cloudflare DNS

### Quick Setup

1. **Clone the repository on your Linux server:**
   ```bash
   git clone https://github.com/kineticdirt/personal_portfolio.git
   cd personal_portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm run install:deps
   ```

3. **Set up Cloudflare tunnel:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > Zero Trust > Access > Tunnels
   - Create a new tunnel named `abhinav-portfolio-tunnel`
   - Download the credentials file and save it as `~/.cloudflared/abhinav-portfolio-tunnel.json`
   - Configure the tunnel with hostname: `portfolio.abhinavallam.com` (or your domain)

4. **Run the setup script:**
   ```bash
   npm run tunnel:setup
   ```

### Available Tunnel Commands

```bash
# Setup and installation
npm run tunnel:setup    # Full tunnel setup
npm run install:deps    # Install system dependencies

# Service management
npm run tunnel:start    # Start services
npm run tunnel:stop     # Stop services
npm run tunnel:restart  # Restart services
npm run tunnel:status   # Check service status
npm run tunnel:logs     # View service logs
npm run tunnel:update   # Pull updates and restart
```

### Manual Script Usage

```bash
# Make scripts executable
chmod +x *.sh

# Install dependencies
./install-dependencies.sh

# Setup tunnel
./setup-cloudflare-tunnel.sh

# Deploy and manage
./deploy.sh start      # Start services
./deploy.sh stop       # Stop services
./deploy.sh restart    # Restart services
./deploy.sh status     # Check status
./deploy.sh logs       # View logs
./deploy.sh update     # Update and restart
```

### Configuration Files

- `cloudflare-tunnel.yml` - Tunnel configuration
- `setup-cloudflare-tunnel.sh` - Full setup script
- `deploy.sh` - Service management script
- `install-dependencies.sh` - Dependency installation

### Service Management

The setup creates two systemd services:
- `abhinav-portfolio.service` - Portfolio web server
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

### Security Features

- Firewall configuration (UFW)
- Fail2ban for intrusion prevention
- Log rotation setup
- Non-root user execution
- Service isolation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhinav Allam**
- Email: abhinavall0123@gmail.com
- GitHub: [@kineticdirt](https://github.com/kineticdirt)
- Portfolio: [kineticdirt.github.io/personal_portfolio](https://kineticdirt.github.io/personal_portfolio)

## 🙏 Acknowledgments

- Font Awesome for the amazing icons
- Google Fonts for the beautiful typography
- GitHub Actions for seamless CI/CD
- The open-source community for inspiration

---

⭐ **Star this repository if you found it helpful!**

🔗 **Connect with me**: [LinkedIn](https://linkedin.com/in/abhinav-allam) | [Email](mailto:abhinavall0123@gmail.com)
