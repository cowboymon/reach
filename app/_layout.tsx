import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Fraunces_400Regular,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '../context/AppContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <StatusBar style="dark" backgroundColor="#F5F0E8" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: '#F5F0E8' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="onboarding-contacts" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="contact/[id]" />
        <Stack.Screen name="reach-out/[id]" />
        <Stack.Screen name="post-contact/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="add-contact" />
      </Stack>
    </AppProvider>
  );
}
