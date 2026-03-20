import { Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { data, isLoading } = useApp();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-linen">
        <ActivityIndicator color="#1C1814" />
      </View>
    );
  }

  if (!data.onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
