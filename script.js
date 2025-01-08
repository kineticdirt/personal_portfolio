// script.js

function greet(name) {
    return `Hello, ${name}! Welcome to the GitHub Actions workflow.`;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-menu .tab');
    const sections = document.querySelectorAll('.tab-section');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activateTab(tab);
      });
  
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTab(tab);
        }
      });
    });
  
    function activateTab(tab) {
      const target = tab.getAttribute('data-tab');
  
      // Remove active class from all tabs and update ARIA
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
  
      // Add active class to the clicked tab and update ARIA
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tab.focus();
  
      // Hide all sections
      sections.forEach(section => section.classList.remove('active'));
  
      // Show the targeted section
      const activeSection = document.getElementById(target);
      if (activeSection) {
        activeSection.classList.add('active');
      }
    }
  
    // Example usage of greet function
    console.log(greet('Abhinav'));
  });
  
  module.exports = { greet };
  