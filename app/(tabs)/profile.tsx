import { View, Text, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { data } = useApp();

  const totalContacts = data.contacts.length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const conversationsThisMonth = data.interactions.filter(
    (i) => new Date(i.date) >= startOfMonth
  ).length;

  const tiers = data.contacts.reduce(
    (acc, c) => {
      acc[c.tier] = (acc[c.tier] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-10"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
        >
          <Text
            className="text-ink mb-16"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, lineHeight: 44, letterSpacing: -0.8 }}
          >
            Your universe
          </Text>
        </MotiView>

        <View style={{ gap: 0 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000, delay: 200 }}
            className="pb-8 mb-8"
            style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(28,24,20,0.08)' }}
          >
            <Text
              className="text-ink mb-3"
              style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, opacity: 0.5, lineHeight: 24 }}
            >
              Stars in your constellation
            </Text>
            <Text
              className="text-ink"
              style={{ fontFamily: 'Fraunces_700Bold', fontSize: 56, lineHeight: 64, letterSpacing: -1.5 }}
            >
              {totalContacts}
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000, delay: 350 }}
            className="pb-8 mb-8"
            style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(28,24,20,0.08)' }}
          >
            <Text
              className="text-ink mb-3"
              style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, opacity: 0.5, lineHeight: 24 }}
            >
              Conversations this month
            </Text>
            <Text
              className="text-ink"
              style={{ fontFamily: 'Fraunces_700Bold', fontSize: 56, lineHeight: 64, letterSpacing: -1.5 }}
            >
              {conversationsThisMonth}
            </Text>
          </MotiView>

          {Object.keys(tiers).length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 1000, delay: 500 }}
            >
              <Text
                className="text-ink mb-6"
                style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, opacity: 0.5, lineHeight: 24 }}
              >
                By closeness
              </Text>
              <View style={{ gap: 12 }}>
                {(['Back', 'Familiar', 'Reconnecting', 'Drifted'] as const).map((tier) => {
                  const count = tiers[tier] ?? 0;
                  if (count === 0) return null;
                  return (
                    <View key={tier} className="flex-row justify-between items-center">
                      <Text
                        style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: '#1C1814', opacity: 0.7 }}
                      >
                        {tier}
                      </Text>
                      <Text
                        style={{ fontFamily: 'Fraunces_700Bold', fontSize: 18, color: '#1C1814' }}
                      >
                        {count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </MotiView>
          )}
        </View>
      </ScrollView>

      <Navigation />
    </View>
  );
}
