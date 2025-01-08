// jest.config.js

module.exports = {
    // Specifies the root directories Jest should scan for tests and modules
    roots: ['<rootDir>/__tests__'],
  
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'jsx'],
  
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
  
    // A map from regular expressions to module names or to arrays of module names
    moduleNameMapper: {
      '\\.(css)$': 'identity-obj-proxy',
    },
  
    // A preset that is used as a base for Jest's configuration
    preset: 'jest',
  
    // Transform files matching the regex with the provided transformer
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
  
    // Indicates whether each individual test should be reported during the run
    verbose: true,
  };
  