module.exports = {
  transform: {
    '^.+\\.(jsx|tsx|js|ts)?$': 'babel-jest'
  },
  reporters: ['default', 'jest-junit'],
  setupFiles: ['./src/setupTests.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '\\.d\\.ts$'],
};