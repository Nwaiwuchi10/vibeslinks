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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type TimeFrame = 'Today' | 'Last Month' | 'Last 2 Month';
type FileType = 'Excel' | 'PDF' | null;

export default function DownloadStatementMain() {
  const router = useRouter();
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>('Last Month');
  const [email, setEmail] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<FileType>(null);

  const timeFrames: TimeFrame[] = ['Today', 'Last Month', 'Last 2 Month'];


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Statement</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Time Frame Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Time Frame</Text>
          <View style={styles.timeFrameRow}>
            {timeFrames.map((tf) => (
              <TouchableOpacity
                key={tf}
                style={[
                  styles.tfBtn,
                  selectedTimeFrame === tf && styles.tfBtnActive,
                ]}
                onPress={() => setSelectedTimeFrame(tf)}
              >
                <Text
                  style={[
                    styles.tfBtnText,
                    selectedTimeFrame === tf && styles.tfBtnTextActive,
                  ]}
                >
                  {tf}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Email Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardSubLabel}>
            Your account statement wil be sent to your email.
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="r*@gmail.com"
              placeholderTextColor="#C7C7CC"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* File Type Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>File Type</Text>
          <Text style={styles.cardSubLabel}>
            Select the format which you would like to receive your account statement.
          </Text>
          {(['Excel', 'PDF'] as const).map((ft, index) => (
            <TouchableOpacity
              key={ft}
              style={[
                styles.fileTypeItem,
                selectedFileType === ft && styles.fileTypeItemActive,
                index === 0 && { marginBottom: 10 },
              ]}
              onPress={() => setSelectedFileType(ft)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.fileTypeText,
                  selectedFileType === ft && styles.fileTypeTextActive,
                ]}
              >
                {ft}
              </Text>
              {selectedFileType === ft && (
                <Ionicons name="checkmark-circle" size={20} color="#7B39FD" />
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Send Statement Button */}
      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity style={styles.sendBtn} activeOpacity={0.85}>
          <Text style={styles.sendBtnText}>Send Statement</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  // Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  cardSubLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 14,
    marginTop: -8,
  },

  // Time Frame
  timeFrameRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tfBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfBtnActive: {
    backgroundColor: '#7B39FD',
  },
  tfBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tfBtnTextActive: {
    color: '#FFF',
  },

  // Email Input
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#FAFAFA',
  },
  textInput: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  // File Type flat cards
  fileTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F9',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#EDEDF2',
  },
  fileTypeItemActive: {
    borderColor: '#7B39FD',
    backgroundColor: '#F5F1FF',
  },
  fileTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  fileTypeTextActive: {
    fontWeight: '700',
    color: '#7B39FD',
  },

  // Bottom Button
  bottomBtnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  sendBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
