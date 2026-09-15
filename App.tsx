import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from '@/AppProviders';
import { RootTabs } from '@/navigation/RootTabs';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProviders>
        <StatusBar barStyle="default" />
        <NavigationContainer>
          <RootTabs />
        </NavigationContainer>
      </AppProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
