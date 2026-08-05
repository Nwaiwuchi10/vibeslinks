import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CreateEventStep4 = ({ onHome }: { onHome: () => void }) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'android' ? Math.max(insets.bottom, 16) : insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.checkContainer}>
          <Ionicons name="checkmark" size={60} color="#FFF" />
        </View>
        <Text style={styles.title}>Event Published</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: 20 + bottomPad }]}>
        <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
          <Text style={styles.homeText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventStep4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  checkContainer: { width: 100, height: 100, borderRadius: 35, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5, shadowColor: '#8E2DE2', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  title: { fontSize: 26, fontWeight: '800', color: '#333' },
  footer: { paddingHorizontal: 25, paddingBottom: 40 },
  homeBtn: { backgroundColor: '#7F36FF', height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  homeText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
