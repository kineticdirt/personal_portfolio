// Modern JavaScript for Portfolio Website
// Using ES6+ features and modern web APIs

class PortfolioApp {
    constructor() {
        this.currentSection = "home";
        this.isDarkMode = this.getStoredTheme();
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.setupScrollSpy();
        this.setupAnimations();
        this.setupResumePreview();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.initializeGreeting();
        this.setupAdminSystem();
        this.setupExperienceExpansion();
        this.setupPDFUpload();
        this.setupRadialGrid();
        this.setupScrollArrow();
    }

    // Theme Management
    initializeTheme() {
        const themeToggle = document.querySelector(".theme-toggle");
        const body = document.body;
        
        if (this.isDarkMode) {
            body.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = "<i class=\"fas fa-moon\"></i>";
        } else {
            body.setAttribute("data-theme", "light");
            themeToggle.innerHTML = "<i class=\"fas fa-sun\"></i>";
        }
    }

    getStoredTheme() {
        const stored = localStorage.getItem("theme");
        if (stored) {
            return stored === "dark";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const body = document.body;
        const themeToggle = document.querySelector(".theme-toggle");
        
        if (this.isDarkMode) {
            body.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = "<i class=\"fas fa-moon\"></i>";
            localStorage.setItem("theme", "dark");
        } else {
            body.setAttribute("data-theme", "light");
            themeToggle.innerHTML = "<i class=\"fas fa-sun\"></i>";
            localStorage.setItem("theme", "light");
        }
    }

    // Navigation Management
    setupEventListeners() {
        const themeToggle = document.querySelector(".theme-toggle");
        themeToggle?.addEventListener("click", () => this.toggleTheme());

        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const section = link.getAttribute("data-section");
                this.navigateToSection(section);
            });
        });

        const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
        mobileMenuToggle?.addEventListener("click", () => this.toggleMobileMenu());
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        this.updateActiveNav(sectionId);
        
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const sectionTop = section.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: "smooth"
        });

        this.currentSection = sectionId;
        this.closeMobileMenu();
    }

    updateActiveNav(sectionId) {
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === sectionId) {
                link.classList.add("active");
            }
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
        const navMenu = document.querySelector(".nav-menu");
        
        if (!mobileMenuToggle || !navMenu) return;

        this.mobileMenuOverlay = document.createElement("div");
        this.mobileMenuOverlay.className = "mobile-menu-overlay";
        this.mobileMenuOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(this.mobileMenuOverlay);
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        const navMenu = document.querySelector(".nav-menu");
        const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
        const hamburger = document.querySelector(".hamburger");
        
        navMenu.style.cssText = `
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            flex-direction: column;
            padding: var(--space-4);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;
        
        setTimeout(() => {
            navMenu.style.transform = "translateY(0)";
        }, 10);
        
        this.mobileMenuOverlay.style.opacity = "1";
        this.mobileMenuOverlay.style.visibility = "visible";
        
        mobileMenuToggle.setAttribute("aria-expanded", "true");
        hamburger.style.transform = "rotate(45deg)";
        hamburger.style.background = "var(--primary-color)";
        
        this.isMenuOpen = true;
    }

    closeMobileMenu() {
        if (!this.isMenuOpen) return;
        
        const navMenu = document.querySelector(".nav-menu");
        const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
        const hamburger = document.querySelector(".hamburger");
        
        navMenu.style.transform = "translateY(-100%)";
        
        setTimeout(() => {
            navMenu.style.cssText = "";
        }, 300);
        
        this.mobileMenuOverlay.style.opacity = "0";
        this.mobileMenuOverlay.style.visibility = "hidden";
        
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        hamburger.style.transform = "";
        hamburger.style.background = "";
        
        this.isMenuOpen = false;
    }

    // Scroll Spy
    setupScrollSpy() {
        const sections = document.querySelectorAll("section[id]");
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNav(sectionId);
                    this.currentSection = sectionId;
                }
            });
        }, {
            root: null,
            rootMargin: "-80px 0px -50% 0px",
            threshold: 0
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Resume Preview
    setupResumePreview() {
        const viewResumeBtn = document.getElementById("view-resume-btn");
        const closePreview = document.getElementById("close-preview");
        
        viewResumeBtn?.addEventListener("click", () => {
            this.openResumePreview();
        });
        
        closePreview?.addEventListener("click", () => {
            this.closeResumePreview();
        });
    }

    openResumePreview() {
        const resumePreview = document.getElementById("resume-preview");
        if (resumePreview) {
            resumePreview.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    closeResumePreview() {
        const resumePreview = document.getElementById("resume-preview");
        if (resumePreview) {
            resumePreview.style.display = "none";
            document.body.style.overflow = "";
        }
    }

    // Enhanced Animations
    setupAnimations() {
        // General scroll animations
        const animateElements = document.querySelectorAll(".about-card, .project-card, .skill-category, .contact-card, .timeline-item");
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    if (entry.target.classList.contains("timeline-item")) {
                        entry.target.classList.add("animate");
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        animateElements.forEach(el => {
            el.classList.add("animate-on-scroll");
            animationObserver.observe(el);
        });

        // Timeline specific animations with stagger
        const timelineItems = document.querySelectorAll(".timeline-item");
        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
        });

        // Add floating animation to hero visual
        const heroVisual = document.querySelector(".hero-visual");
        if (heroVisual) {
            heroVisual.classList.add("float-animation");
        }

        // Add glow animation to CTA buttons
        const ctaButtons = document.querySelectorAll(".btn-primary");
        ctaButtons.forEach(btn => {
            btn.addEventListener("mouseenter", () => {
                btn.classList.add("glow-animation");
            });
            btn.addEventListener("mouseleave", () => {
                btn.classList.remove("glow-animation");
            });
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
            anchor.addEventListener("click", (e) => {
          e.preventDefault();
                const target = document.querySelector(anchor.getAttribute("href"));
                if (target) {
                    const navbarHeight = document.querySelector(".navbar").offsetHeight;
                    const targetPosition = target.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
        }
      });
    });
    }

    // Initialize greeting function (preserved from original)
    initializeGreeting() {
        const greetingElement = document.querySelector(".greeting");
        if (greetingElement) {
            const timeOfDay = this.getTimeOfDay();
            greetingElement.textContent = `${timeOfDay}, I'm`;
        }
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }

    // Admin System
    setupAdminSystem() {
        this.isAdminLoggedIn = false;
        this.adminCredentials = {
            username: 'admin',
            password: 'portfolio2025'
        };
        
        this.setupAdminEventListeners();
        this.loadAdminData();
    }

    setupAdminEventListeners() {
        const adminAccessBtn = document.getElementById('admin-access-btn');
        adminAccessBtn?.addEventListener('click', () => {
            if (this.isAdminLoggedIn) {
                this.toggleAdminPanel();
            } else {
                this.showLoginModal();
            }
        });

        const loginModal = document.getElementById('admin-login-modal');
        const closeLoginModal = document.getElementById('close-login-modal');
        const adminLoginBtn = document.getElementById('admin-login-btn');

        closeLoginModal?.addEventListener('click', () => {
            this.hideLoginModal();
        });

        adminLoginBtn?.addEventListener('click', () => {
            this.handleAdminLogin();
        });

        const adminPanel = document.getElementById('admin-panel');
        const closeAdmin = document.getElementById('close-admin');
        const saveChanges = document.getElementById('save-changes');
        const previewChanges = document.getElementById('preview-changes');
        const resetChanges = document.getElementById('reset-changes');

        closeAdmin?.addEventListener('click', () => {
            this.hideAdminPanel();
        });

        saveChanges?.addEventListener('click', () => {
            this.saveAdminChanges();
        });

        previewChanges?.addEventListener('click', () => {
            this.previewAdminChanges();
        });

        resetChanges?.addEventListener('click', () => {
            this.resetAdminChanges();
        });

        loginModal?.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                this.hideLoginModal();
            }
        });
    }

    showLoginModal() {
        const loginModal = document.getElementById('admin-login-modal');
        if (loginModal) {
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideLoginModal() {
        const loginModal = document.getElementById('admin-login-modal');
        if (loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username')?.value;
        const password = document.getElementById('admin-password')?.value;

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.isAdminLoggedIn = true;
            this.hideLoginModal();
            this.showAdminPanel();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials!', 'error');
        }
    }

    showAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
            setTimeout(() => {
                adminPanel.classList.add('open');
            }, 10);
        }
    }

    hideAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.classList.remove('open');
            setTimeout(() => {
                adminPanel.style.display = 'none';
            }, 300);
        }
    }

    toggleAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel.style.display === 'none') {
            this.showAdminPanel();
        } else {
            this.hideAdminPanel();
        }
    }

    loadAdminData() {
        const whoIAm = document.querySelector('.about-card:nth-child(1) p')?.textContent;
        const whatIDo = document.querySelector('.about-card:nth-child(2) p')?.textContent;
        const beyondCode = document.querySelector('.about-card:nth-child(3) p')?.textContent;
        const yearsExp = document.querySelector('.stat-number')?.textContent;
        const projectsCount = document.querySelector('.stat-card:nth-child(2) .stat-number')?.textContent;
        const aiAccuracy = document.querySelector('.stat-card:nth-child(3) .stat-number')?.textContent;

        if (whoIAm) document.getElementById('edit-who-i-am').value = whoIAm;
        if (whatIDo) document.getElementById('edit-what-i-do').value = whatIDo;
        if (beyondCode) document.getElementById('edit-beyond-code').value = beyondCode;
        if (yearsExp) document.getElementById('edit-years-exp').value = yearsExp;
        if (projectsCount) document.getElementById('edit-projects-count').value = projectsCount;
        if (aiAccuracy) document.getElementById('edit-ai-accuracy').value = aiAccuracy;
    }

    previewAdminChanges() {
        const whoIAm = document.getElementById('edit-who-i-am')?.value;
        const whatIDo = document.getElementById('edit-what-i-do')?.value;
        const beyondCode = document.getElementById('edit-beyond-code')?.value;
        const yearsExp = document.getElementById('edit-years-exp')?.value;
        const projectsCount = document.getElementById('edit-projects-count')?.value;
        const aiAccuracy = document.getElementById('edit-ai-accuracy')?.value;

        if (whoIAm) document.querySelector('.about-card:nth-child(1) p').textContent = whoIAm;
        if (whatIDo) document.querySelector('.about-card:nth-child(2) p').textContent = whatIDo;
        if (beyondCode) document.querySelector('.about-card:nth-child(3) p').textContent = beyondCode;
        if (yearsExp) document.querySelector('.stat-number').textContent = yearsExp;
        if (projectsCount) document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = projectsCount;
        if (aiAccuracy) document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = aiAccuracy;

        this.showNotification('Preview updated!', 'success');
    }

    saveAdminChanges() {
        this.previewAdminChanges();
        localStorage.setItem('portfolioContent', JSON.stringify({
            whoIAm: document.getElementById('edit-who-i-am')?.value,
            whatIDo: document.getElementById('edit-what-i-do')?.value,
            beyondCode: document.getElementById('edit-beyond-code')?.value,
            yearsExp: document.getElementById('edit-years-exp')?.value,
            projectsCount: document.getElementById('edit-projects-count')?.value,
            aiAccuracy: document.getElementById('edit-ai-accuracy')?.value,
            lastUpdated: new Date().toISOString()
        }));
        
        this.showNotification('Changes saved successfully!', 'success');
    }

    resetAdminChanges() {
        this.loadAdminData();
        this.showNotification('Changes reset!', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        switch (type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'info':
                notification.style.background = '#3b82f6';
                break;
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Project Counter System
    calculateProjectStats() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        let totalProjects = 0;
        let totalYears = 0;
        
        timelineItems.forEach(item => {
            const description = item.querySelector('.timeline-description')?.textContent || '';
            const dateRange = item.querySelector('.timeline-date')?.textContent || '';
            
            // Extract project counts from descriptions
            const projectMatches = description.match(/(\d+)\+/g);
            if (projectMatches) {
                projectMatches.forEach(match => {
                    totalProjects += parseInt(match.replace('+', ''));
                });
            }
            
            // Calculate years from date ranges
            const yearMatch = dateRange.match(/(\d{4})/g);
            if (yearMatch && yearMatch.length >= 2) {
                const startYear = parseInt(yearMatch[0]);
                const endYear = parseInt(yearMatch[1]);
                if (endYear > startYear) {
                    totalYears += (endYear - startYear);
                } else {
                    totalYears += 1; // Current year
                }
            }
        });
        
        return {
            projects: totalProjects,
            years: totalYears
        };
    }

    updateProjectStats() {
        const stats = this.calculateProjectStats();
        
        // Update the statistics display
        const yearsElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        const projectsElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        
        if (yearsElement) {
            yearsElement.textContent = `${stats.years}+`;
        }
        if (projectsElement) {
            projectsElement.textContent = `${stats.projects}+`;
        }
        
        // Update admin panel fields
        const yearsInput = document.getElementById('edit-years-exp');
        const projectsInput = document.getElementById('edit-projects-count');
        
        if (yearsInput) {
            yearsInput.value = `${stats.years}+`;
        }
        if (projectsInput) {
            projectsInput.value = `${stats.projects}+`;
        }
        
        return stats;
    }

    // Experience Timeline Expansion
    setupExperienceExpansion() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                const isExpanded = item.getAttribute('data-expanded') === 'true';
                
                // Close all other expanded items
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.setAttribute('data-expanded', 'false');
                        const expandedContent = otherItem.querySelector('.timeline-expanded');
                        if (expandedContent) {
                            expandedContent.style.display = 'none';
                        }
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    item.setAttribute('data-expanded', 'false');
                    const expandedContent = item.querySelector('.timeline-expanded');
                    if (expandedContent) {
                        expandedContent.style.display = 'none';
                    }
                    document.body.style.overflow = '';
                } else {
                    item.setAttribute('data-expanded', 'true');
                    const expandedContent = item.querySelector('.timeline-expanded');
                    if (expandedContent) {
                        expandedContent.style.display = 'block';
                    }
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    item.setAttribute('data-expanded', 'false');
                    const expandedContent = item.querySelector('.timeline-expanded');
                    if (expandedContent) {
                        expandedContent.style.display = 'none';
                    }
                    document.body.style.overflow = '';
        }
      });
    });
    }

    // PDF Upload System
    setupPDFUpload() {
        this.pdfAnalyzer = new PDFAnalyzer();
        this.selectedFile = null;
        
        this.setupPDFEventListeners();
    }

    setupPDFEventListeners() {
        // Upload resume button
        const uploadResumeBtn = document.getElementById('upload-resume');
        uploadResumeBtn?.addEventListener('click', () => {
            this.showPDFUploadModal();
        });

        // PDF upload modal
        const pdfModal = document.getElementById('pdf-upload-modal');
        const closePdfModal = document.getElementById('close-pdf-modal');
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('pdf-file-input');
        const processBtn = document.getElementById('process-pdf');
        const cancelBtn = document.getElementById('cancel-upload');

        closePdfModal?.addEventListener('click', () => {
            this.hidePDFUploadModal();
        });

        uploadArea?.addEventListener('click', () => {
            fileInput?.click();
        });

        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea?.addEventListener('drop', (e) => {
          e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        fileInput?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        processBtn?.addEventListener('click', () => {
            this.processPDF();
        });

        cancelBtn?.addEventListener('click', () => {
            this.hidePDFUploadModal();
        });

        // Close modal on outside click
        pdfModal?.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                this.hidePDFUploadModal();
            }
        });
    }

    showPDFUploadModal() {
        const pdfModal = document.getElementById('pdf-upload-modal');
        if (pdfModal) {
            pdfModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hidePDFUploadModal() {
        const pdfModal = document.getElementById('pdf-upload-modal');
        if (pdfModal) {
            pdfModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.resetUploadState();
    }

    handleFileSelect(file) {
        if (file.type !== 'application/pdf') {
            this.showNotification('Please select a PDF file', 'error');
            return;
        }

        this.selectedFile = file;
        const uploadArea = document.getElementById('upload-area');
        const processBtn = document.getElementById('process-pdf');
        
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fas fa-file-pdf"></i>
                <p>Selected: ${file.name}</p>
                <small>Click "Process Resume" to analyze</small>
            `;
        }
        
        if (processBtn) {
            processBtn.disabled = false;
        }
    }

    async processPDF() {
        if (!this.selectedFile) return;

        const uploadProgress = document.getElementById('upload-progress');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.getElementById('progress-text');
        const processBtn = document.getElementById('process-pdf');

        // Show progress
        uploadProgress.style.display = 'block';
        processBtn.disabled = true;

        try {
            // Simulate progress
            this.simulateProgress(progressFill, progressText);

            // Analyze PDF
            const resumeData = await this.pdfAnalyzer.analyzeResume(this.selectedFile);
            
            // Populate website
            await this.pdfAnalyzer.populateWebsite(resumeData);
            
            this.showNotification('Resume processed successfully!', 'success');
            this.hidePDFUploadModal();
            
        } catch (error) {
            console.error('Error processing PDF:', error);
            this.showNotification('Error processing PDF: ' + error.message, 'error');
            uploadProgress.style.display = 'none';
            processBtn.disabled = false;
        }
    }

    simulateProgress(progressFill, progressText) {
        const steps = [
            { progress: 20, text: 'Uploading PDF...' },
            { progress: 40, text: 'Analyzing content...' },
            { progress: 60, text: 'Extracting data...' },
            { progress: 80, text: 'Structuring information...' },
            { progress: 100, text: 'Updating website...' }
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                progressFill.style.width = step.progress + '%';
                progressText.textContent = step.text;
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 800);
    }

    resetUploadState() {
        this.selectedFile = null;
        const uploadArea = document.getElementById('upload-area');
        const processBtn = document.getElementById('process-pdf');
        const uploadProgress = document.getElementById('upload-progress');
        
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop your resume PDF here or click to browse</p>
            `;
        }
        
        if (processBtn) {
            processBtn.disabled = true;
        }
        
        if (uploadProgress) {
            uploadProgress.style.display = 'none';
        }
    }

    // Radial Grid System
    setupRadialGrid() {
        const heroSection = document.querySelector('.hero-section');
        const radialGridOverlay = document.getElementById('radial-grid-overlay');
        
        if (!heroSection || !radialGridOverlay) return;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            radialGridOverlay.style.setProperty('--mouse-x', `${x}%`);
            radialGridOverlay.style.setProperty('--mouse-y', `${y}%`);
        });

        // Reset position when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            radialGridOverlay.style.setProperty('--mouse-x', '50%');
            radialGridOverlay.style.setProperty('--mouse-y', '50%');
        });
    }

    // Section Scroll Arrows Functionality
    setupScrollArrow() {
        const sectionArrows = document.querySelectorAll('.section-scroll-arrow');
        
        sectionArrows.forEach(arrow => {
            arrow.addEventListener('click', () => {
                const nextSectionId = arrow.getAttribute('data-next-section');
                const nextSection = document.getElementById(nextSectionId);
                
                if (nextSection) {
                    nextSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
        }
      });
    });
  
        // Back to top functionality
        const backToTopLink = document.querySelector('.back-to-top-link');
        if (backToTopLink) {
            backToTopLink.addEventListener('click', (e) => {
                e.preventDefault();
                const homeSection = document.getElementById('home');
                if (homeSection) {
                    homeSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    }
}

// Greeting function (preserved from original for GitHub Actions)
function greet(name) {
    return `Hello, ${name}! Welcome to the GitHub Actions workflow.`;
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.portfolioApp = new PortfolioApp();
    console.log(greet("Abhinav"));
    
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";
    
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// Export for module systems (preserved from original)
module.exports = { greet, PortfolioApp };
  