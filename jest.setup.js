// Jest setup file for testing environment
// This file is run before each test file

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
    }))
});

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: jest.fn()
});

// Mock getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
    value: () => ({
        getPropertyValue: () => ""
    })
});

// Suppress console.log in tests unless explicitly needed
const originalConsoleLog = console.log;
console.log = jest.fn();

// Restore console.log for specific tests if needed
global.restoreConsoleLog = () => {
    console.log = originalConsoleLog;
};

