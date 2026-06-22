import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_W = (width - 40 - 12) / 2;

type CampaignType = {
  id: string;
  icon: string; // emoji as stand-in for flaticon
  iconBg: string;
  title: string;
  description: string;
};

const CAMPAIGN_TYPES: CampaignType[] = [
  {
    id: 'event_placement',
    icon: '🏷️',
    iconBg: '#FFF3DC',
    title: 'Event Placement',
    description: 'Feature event on Vibezlink Discover.',
  },
  {
    id: 'push_notifications',
    icon: '🔔',
    iconBg: '#FFE8EE',
    title: 'Push Notifications',
    description: 'Send event alerts to targeted users.',
  },
  {
    id: 'social_feeds',
    icon: '📋',
    iconBg: '#EEF0FF',
    title: 'Social Feeds',
    description: 'Boost visibility in feeds.',
  },
  {
    id: 'email_campaign',
    icon: '✉️',
    iconBg: '#E8F4FF',
    title: 'Email Campaign',
    description: 'Send event promotions to subscribers.',
  },
  {
    id: 'social_media_boost',
    icon: '🌐',
    iconBg: '#EDFFF0',
    title: 'Social Media Boost',
    description:
      'Using external platforms such as Facebook, TikTok, Twitter, etc. to increase reach.',
  },
];

export default function CampaignTypesMain() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(['push_notifications', 'social_media_boost'])
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Last card spans full width
  const gridItems = CAMPAIGN_TYPES.slice(0, 4);
  const lastItem = CAMPAIGN_TYPES[4];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F4FF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Campaign Types</Text>
          <Text style={styles.headerSubtitle}>You can select multiple cards</Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 2×2 Grid ── */}
        <View style={styles.grid}>
          {gridItems.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                activeOpacity={0.85}
                onPress={() => toggleSelect(item.id)}
              >
                {/* Radio indicator */}
                <View style={styles.radioWrapper}>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>

                {/* Icon */}
                <View style={[styles.iconBg, { backgroundColor: item.iconBg }]}>
                  <Text style={styles.iconEmoji}>{item.icon}</Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Full-width last card ── */}
        {lastItem && (() => {
          const isSelected = selected.has(lastItem.id);
          return (
            <TouchableOpacity
              style={[styles.cardFull, isSelected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => toggleSelect(lastItem.id)}
            >
              {/* Radio indicator */}
              <View style={styles.radioWrapperFull}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>

              {/* Icon */}
              <View style={[styles.iconBg, { backgroundColor: lastItem.iconBg }]}>
                <Text style={styles.iconEmoji}>{lastItem.icon}</Text>
              </View>

              <Text style={styles.cardTitle}>{lastItem.title}</Text>
              <Text style={styles.cardDescFull}>{lastItem.description}</Text>
            </TouchableOpacity>
          );
        })()}
      </ScrollView>

      {/* ── Next Button ── */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextBtn, selected.size === 0 && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          disabled={selected.size === 0}
          onPress={() => router.push('/dashboard/budget-duration')}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EBEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Card (half-width)
  card: {
    width: CARD_W,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 140,
    gap: 6,
  },
  cardSelected: {
    borderColor: '#7B39FD',
    backgroundColor: '#FAF7FF',
  },
  radioWrapper: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  radioWrapperFull: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#7B39FD',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7B39FD',
  },

  // Icon
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconEmoji: {
    fontSize: 22,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 16,
    paddingRight: 24,
  },

  // Full-width card (last)
  cardFull: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 110,
    gap: 6,
  },
  cardDescFull: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 16,
    paddingRight: 28,
    maxWidth: '80%',
  },

  // Bottom
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F4FF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  nextBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#C4AAFF',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
