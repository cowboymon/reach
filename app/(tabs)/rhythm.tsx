import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import type { Feeling } from '../../types';

const FEELING_COLORS: Record<Feeling, string> = {
  Good: '#D4A843',
  Quiet: '#7A9E87',
  Hard: '#C47A7A',
};

export default function Rhythm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getWeeklyInteractions } = useApp();

  const days = getWeeklyInteractions();
  const reachedCount = days.filter((d) => d.contact !== null).length;

  return (
    <View className="flex-1 bg-linen" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-10"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1400, delay: 300 }}
        >
          <Text
            className="text-ink mb-16"
            style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, lineHeight: 44, letterSpacing: -0.8 }}
          >
            Your constellation this week.
          </Text>
        </MotiView>

        <View className="mb-16">
          {days.map((day, index) => (
            <MotiView
              key={day.date + index}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 900, delay: 120 * (index + 2) }}
            >
              <View
                className="flex-row items-center gap-5"
                style={{
                  paddingTop: day.contact ? 24 : 14,
                  paddingBottom: day.contact ? 24 : 14,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(28,24,20,0.06)',
                  gap: 20,
                }}
              >
                {/* Day label */}
                <Text
                  style={{
                    width: 36,
                    fontFamily: 'PlusJakartaSans_500Medium',
                    fontSize: 12,
                    color: '#1C1814',
                    opacity: day.contact ? 0.5 : 0.25,
                  }}
                >
                  {day.date}
                </Text>

                {/* Dot */}
                <View style={{ width: 20, alignItems: 'center' }}>
                  {day.contact ? (
                    <MotiView
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 120 * (index + 2) + 300 }}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: day.feeling ? FEELING_COLORS[day.feeling] : '#D4A843',
                      }}
                    />
                  ) : (
                    <View
                      style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#1C1814', opacity: 0.1 }}
                    />
                  )}
                </View>

                {/* Name / rest */}
                {day.contact ? (
                  <TouchableOpacity
                    onPress={() => router.push(`/contact/${day.contact!.id}`)}
                    activeOpacity={0.7}
                    className="flex-row items-baseline"
                    style={{ gap: 12 }}
                  >
                    <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 18, color: '#1C1814', lineHeight: 28 }}>
                      {day.contact.name}
                    </Text>
                    {day.feeling && (
                      <Text
                        style={{
                          fontFamily: 'PlusJakartaSans_500Medium',
                          fontSize: 12,
                          color: FEELING_COLORS[day.feeling],
                        }}
                      >
                        {day.feeling}
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text
                    className="italic"
                    style={{ fontFamily: 'Fraunces_400Regular', fontSize: 14, color: '#1C1814', opacity: 0.2 }}
                  >
                    rest
                  </Text>
                )}
              </View>
            </MotiView>
          ))}
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1200, delay: 120 * (days.length + 3) }}
        >
          <Text
            className="text-ink italic text-center"
            style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, opacity: 0.5, lineHeight: 32 }}
          >
            {reachedCount === 0
              ? 'The week is young. Who will you reach?'
              : `${reachedCount} ${reachedCount === 1 ? 'person' : 'people'} this week. A good rhythm.`}
          </Text>
        </MotiView>
      </ScrollView>

      <Navigation />
    </View>
  );
}
