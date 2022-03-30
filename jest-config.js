module.exports = {
  setupFilesAfterEnv: ['<rootDir>src/setupTests.js'],
  transform: {
    '^.+\\.(jsx|tsx|js|ts})?$': 'babel-jest'
  },
  reporters: ['default', 'jest-junit']
};
