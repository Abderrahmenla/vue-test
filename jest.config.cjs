module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customResourceLoader: {
      '/fonts/': '<rootDir>/static/fonts/'
    },
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vuetify/lib': '<rootDir>/__mocks__/vuetify-lib.js'
  },
  // Files to ignore during testing
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  // Test match patterns - combined into one
  testMatch: [
    '<rootDir>/tests/**/*.spec.js',
    '<rootDir>/tests/**/*.test.js',
    '**/tests/unit/**/*.spec.js'
  ],
  globals: {
    'vue-jest': {
      // Add any vue-jest specific config here if needed
    }
  },
  // Collect coverage from these files
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/layouts/**/*.vue',
    '<rootDir>/plugins/**/*.js',
    '<rootDir>/store/**/*.js'
  ],
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // Serializer for Vue components
  snapshotSerializers: ['jest-serializer-vue'],
  // Clear mocks between tests
  clearMocks: true
}