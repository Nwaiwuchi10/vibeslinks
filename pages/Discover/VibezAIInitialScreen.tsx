import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SUGGESTIONS = [
  "Tonight's Hottest Events",
  "Free Events Near Me",
  "Live Amapiano Shows",
  "Best Clubs This Weekend",
  "Events My Friends May Like",
  "VIP Experiences",
  "Trending Festivals",
];

const VibezAIInitialScreen = ({ onBack, onSuggestionPress }: { onBack: () => void, onSuggestionPress: (s: string) => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleRegular}>Discover your next</Text>
          <Text style={styles.titleAccent}>Experience</Text>
        </View>

        <View style={styles.suggestionContainer}>
          {SUGGESTIONS.map((s, idx) => (
            <TouchableOpacity key={idx} style={styles.suggestionChip} onPress={() => onSuggestionPress(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ask Vibez Ai"
            placeholderTextColor="#999"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="arrow-up" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VibezAIInitialScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20 },
  titleContainer: { marginBottom: 40 },
  titleRegular: { fontSize: 36, fontWeight: '800', color: '#1E1E1E', lineHeight: 42 },
  titleAccent: { fontSize: 36, fontWeight: '800', color: '#8E2DE2', lineHeight: 42 },
  suggestionContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  suggestionChip: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 25, backgroundColor: '#F3E8FF' },
  suggestionText: { color: '#8E2DE2', fontSize: 13, fontWeight: '600' },
  inputWrapper: { paddingHorizontal: 20, paddingBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 30, paddingHorizontal: 20, height: 55, borderWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, fontSize: 15, color: '#333' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center' },
});
