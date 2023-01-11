module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-actions'],
  docs: {
    autodocs: true
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  }
};