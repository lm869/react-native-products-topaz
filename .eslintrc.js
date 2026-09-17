module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['react-native-mmkv'],
            message:
              'Import react-native-mmkv only from src/storage/mmkv.ts (Constitution Art. I §2, Art. X).',
          },
        ],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
  overrides: [
    {
      files: ['src/storage/mmkv.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['src/features/favorites/components/FavoriteButton.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-native',
                importNames: ['Animated'],
                message:
                  'Use react-native-reanimated for animations in FavoriteButton (Constitution Art. VIII §3).',
              },
            ],
          },
        ],
      },
    },
  ],
};
