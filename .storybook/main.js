module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-webpack5-compiler-babel'
  ],
  docs: {},
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  }
};