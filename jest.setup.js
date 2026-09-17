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

jest.mock('@d11/react-native-fast-image', () => {
  const React = require('react');
  const FastImage = React.forwardRef((props, ref) =>
    React.createElement('FastImage', { ...props, ref }),
  );
  FastImage.resizeMode = { contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center' };
  FastImage.priority = { low: 'low', normal: 'normal', high: 'high' };
  FastImage.cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };
  return { __esModule: true, default: FastImage, FastImage };
});

jest.mock('@react-native-vector-icons/material-design-icons', () => ({
  MaterialDesignIcons: 'MaterialDesignIcons',
  Icon: 'Icon',
}));

global.__reanimatedWorkletInit = jest.fn();
