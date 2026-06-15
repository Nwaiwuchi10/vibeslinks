import { Colors } from '@/constants/Colors';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Interest {
  id: string;
  name: string;
  icon: string;
  family: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
}

const INTERESTS: Interest[] = [
  { id: '1', name: 'Afrobeats', icon: 'musical-notes', family: 'Ionicons' },
  { id: '2', name: 'Amapiano', icon: 'music-note', family: 'MaterialCommunityIcons' },
  { id: '3', name: 'EDM', icon: 'headset', family: 'Ionicons' },
  { id: '4', name: 'Festivals', icon: 'tent', family: 'MaterialCommunityIcons' },
  { id: '5', name: 'Nightlife', icon: 'moon', family: 'Ionicons' },
  { id: '6', name: 'DJ Shows', icon: 'disc', family: 'Ionicons' },
  { id: '7', name: 'Live Bands', icon: 'microphone', family: 'MaterialCommunityIcons' },
  { id: '8', name: 'Comedy', icon: 'drama-masks', family: 'MaterialCommunityIcons' },
  { id: '9', name: 'Sports Events', icon: 'football', family: 'Ionicons' },
];

export default function InterestsScreen() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      if (selected.length < 5) {
        setSelected([...selected, id]);
      }
    }
  };

  const renderIcon = (item: Interest, isSelected: boolean) => {
    const color = isSelected ? '#FFFFFF' : '#333333';
    const size = 18;

    if (item.family === 'Ionicons') {
      return <Ionicons name={item.icon as any} size={size} color={color} style={styles.iconStyle} />;
    } else if (item.family === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={item.icon as any} size={size} color={color} style={styles.iconStyle} />;
    } else {
      return <FontAwesome5 name={item.icon as any} size={size} color={color} style={styles.iconStyle} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressText}>1/3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Select up to 5 interest</Text>
        <Text style={styles.subtitle}>What are you into?</Text>

        <View style={styles.pillsContainer}>
          {INTERESTS.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
                onPress={() => toggleInterest(item.id)}
                activeOpacity={0.8}
              >
                {renderIcon(item, isSelected)}
                <Text style={[styles.pillText, isSelected ? styles.textSelected : styles.textUnselected]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selected.length === 0 && styles.nextButtonDisabled]}
          activeOpacity={0.88}
          onPress={() => router.push('/(onboarding)/location' as any)}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    width: 140,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '33%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#8A8A8A',
    marginBottom: 40,
    textAlign: 'center',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 4, // additional spacing for the wrap
  },
  pillUnselected: {
    backgroundColor: '#F3F3F3',
  },
  pillSelected: {
    backgroundColor: '#000000',
  },
  iconStyle: {
    marginRight: 8,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  textUnselected: {
    color: '#333333',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  nextButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
