module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(' +
      'react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-screens' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|react-native-mmkv' +
      '|@d11/react-native-fast-image' +
      '|zustand' +
      ')/)',
  ],
};
