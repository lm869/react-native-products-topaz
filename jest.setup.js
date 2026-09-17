require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-mmkv', () => {
  const store = new Map();
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      set: (key, value) => store.set(key, value),
      getString: key => store.get(key) ?? undefined,
      getNumber: key => store.get(key) ?? undefined,
      getBoolean: key => store.get(key) ?? undefined,
      delete: key => store.delete(key),
      clearAll: () => store.clear(),
      getAllKeys: () => Array.from(store.keys()),
      contains: key => store.has(key),
    })),
  };
});

jest.mock('@d11/react-native-fast-image', () => 'FastImage');

jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');

global.__reanimatedWorkletInit = jest.fn();
