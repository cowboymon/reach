import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="contacts" />
      <Tabs.Screen name="rhythm" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
