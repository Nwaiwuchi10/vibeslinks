import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';

const { width, height } = Dimensions.get('window');

export default function LoadingSpinner() {
  const isLoading = useAppSelector((state) => state.loading.loadingCount > 0);

  if (!isLoading) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isLoading}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.spinnerCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width,
    height,
    backgroundColor: 'rgba(17, 18, 24, 0.65)', // Semi-transparent VibesLink dark bg
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  spinnerCard: {
    paddingVertical: 24,
    paddingHorizontal: 36,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
  },
});
