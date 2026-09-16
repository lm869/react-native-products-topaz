import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from '@/AppProviders';
import { RootTabs } from '@/navigation/RootTabs';
import { useAppTheme } from '@/theme/ThemeContext';
import { toNavigationTheme } from '@/theme/navTheme';

function ThemedShell(): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={toNavigationTheme(theme)}>
        <RootTabs />
      </NavigationContainer>
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProviders>
        <ThemedShell />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
