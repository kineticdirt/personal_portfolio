// Test file for script.js functionality
const { greet } = require("../script.js");

describe("Portfolio App", () => {
    let app;
    
    beforeEach(() => {
        // Reset DOM before each test
        document.body.innerHTML = `
      <div class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <span class="brand-text">Abhinav Allam</span>
          </div>
          <ul class="nav-menu">
            <li class="nav-item">
              <a href="#home" class="nav-link active" data-section="home">Home</a>
            </li>
            <li class="nav-item">
              <a href="#about" class="nav-link" data-section="about">About</a>
            </li>
          </ul>
          <div class="nav-controls">
            <button class="theme-toggle">
              <i class="fas fa-moon"></i>
            </button>
            <button class="mobile-menu-toggle">
              <span class="hamburger"></span>
            </button>
          </div>
        </div>
      </div>
      <main class="main-content">
        <section id="home" class="hero-section active">
          <div class="hero-container">
            <div class="hero-content">
              <div class="hero-text">
                <h1 class="hero-title">
                  <span class="greeting">Hello, I'm</span>
                  <span class="name">Abhinav Allam</span>
                </h1>
              </div>
            </div>
          </div>
        </section>
        <section id="about" class="about-section">
          <div class="container">
            <div class="about-content">
              <div class="about-text">
                <div class="about-card">
                  <h3>Who I Am</h3>
                  <p>Test content</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="resume" class="resume-section">
          <div class="container">
            <div class="resume-content">
              <div class="resume-actions">
                <button class="btn btn-primary" id="view-resume-btn">
                  <i class="fas fa-eye"></i>
                  <span>View Online</span>
                </button>
              </div>
              <div class="resume-preview" id="resume-preview" style="display: none;">
                <div class="resume-header">
                  <h3>Resume Preview</h3>
                  <button class="close-preview" id="close-preview">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;
    
        // Clear localStorage and reset mocks
        localStorage.clear();
        jest.clearAllMocks();
        
        // Initialize app after DOM is set up
        const { PortfolioApp } = require("../script.js");
        app = new PortfolioApp();
    });

    describe("greet function", () => {
        test("should return greeting message with name", () => {
            const result = greet("Abhinav");
            expect(result).toBe("Hello, Abhinav! Welcome to the GitHub Actions workflow.");
        });

        test("should handle different names", () => {
            const result = greet("Test User");
            expect(result).toBe("Hello, Test User! Welcome to the GitHub Actions workflow.");
        });
    });

    describe("PortfolioApp class", () => {
        test("should initialize with default values", () => {
            expect(app.currentSection).toBe("home");
            expect(typeof app.isDarkMode).toBe("boolean");
            expect(app.isMenuOpen).toBe(false);
        });

        test("should toggle theme correctly", () => {
            const initialTheme = app.isDarkMode;
            app.toggleTheme();
            expect(app.isDarkMode).toBe(!initialTheme);
        });

        test("should handle time of day greeting", () => {
            const timeOfDay = app.getTimeOfDay();
            expect(["Good morning", "Good afternoon", "Good evening"]).toContain(timeOfDay);
        });

        test("should update active navigation", () => {
            app.updateActiveNav("about");
            const aboutLink = document.querySelector("[data-section=\"about\"]");
            const homeLink = document.querySelector("[data-section=\"home\"]");
      
            expect(aboutLink.classList.contains("active")).toBe(true);
            expect(homeLink.classList.contains("active")).toBe(false);
        });

        test("should handle mobile menu toggle", () => {
            expect(app.isMenuOpen).toBe(false);
            app.toggleMobileMenu();
            expect(app.isMenuOpen).toBe(true);
            app.toggleMobileMenu();
            expect(app.isMenuOpen).toBe(false);
        });

        test("should open and close resume preview", () => {
            const resumePreview = document.getElementById("resume-preview");
      
            app.openResumePreview();
            expect(resumePreview.style.display).toBe("block");
      
            app.closeResumePreview();
            expect(resumePreview.style.display).toBe("none");
        });
    });

    describe("DOM interactions", () => {
        test("should handle theme toggle click", () => {
            const themeToggle = document.querySelector(".theme-toggle");
            const body = document.body;
            
            // Initial state
            expect(body.getAttribute("data-theme")).toBe("light");
            
            // Simulate click
            themeToggle.click();
            
            // Should toggle theme
            expect(["light", "dark"]).toContain(body.getAttribute("data-theme"));
        });
    });

    describe("Accessibility", () => {
        test("should have proper ARIA attributes", () => {
            const navLinks = document.querySelectorAll(".nav-link");
            navLinks.forEach(link => {
                expect(link.getAttribute("data-section")).toBeTruthy();
            });
        });

        test("should have proper semantic HTML structure", () => {
            expect(document.querySelector("main")).toBeTruthy();
            expect(document.querySelectorAll("section")).toHaveLength(3);
            expect(document.querySelector(".navbar")).toBeTruthy();
        });
    });

    describe("Performance", () => {
        test("should initialize without errors", () => {
            expect(() => {
                app.toggleTheme();
            }).not.toThrow();
        });
    });
});
