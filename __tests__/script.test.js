// __tests__/script.test.js

const { greet } = require('../script.js');

describe('greet function', () => {
  it('should return a greeting message with the provided name', () => {
    const name = 'World';
    const result = greet(name);
    expect(result).toBe('Hello, World! Welcome to the GitHub Actions workflow.');
  });

  it('should work with different names', () => {
    const name = 'Jest';
    const result = greet(name);
    expect(result).toBe('Hello, Jest! Welcome to the GitHub Actions workflow.');
  });
});