import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 justify-center px-10">
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1400, delay: 200 }}
        >
          <Text
            className="text-ink mb-6"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 36, lineHeight: 48, letterSpacing: -0.8 }}
          >
            The people who matter most deserve more than a like.
          </Text>
          <Text
            className="text-ink italic"
            style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, lineHeight: 32, opacity: 0.5 }}
          >
            Reach helps you stay close to the ones who count.
          </Text>
        </MotiView>
      </View>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 1200, delay: 1000 }}
        className="px-10 pb-12"
        style={{ paddingBottom: Math.max(insets.bottom + 24, 48) }}
      >
        <TouchableOpacity
          onPress={() => router.push('/onboarding-contacts')}
          activeOpacity={0.8}
          className="w-full py-4 border items-center"
          style={{ borderColor: 'rgba(28,24,20,0.2)', borderRadius: 4 }}
        >
          <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: '#1C1814' }}>
            Get started
          </Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}
