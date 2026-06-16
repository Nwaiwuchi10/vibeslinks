import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  Modal as RNModal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CancelImpactMain() {
  const router = useRouter();
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impact Summary</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Impact Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {/* Box 1 */}
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Text style={styles.statValue}>2,540</Text>
                <View style={styles.arrowIconBg}>
                  <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
                </View>
              </View>
              <Text style={styles.statLabel}>Tickets Sold</Text>
            </View>

            {/* Box 2 (Refund highlight) */}
            <View style={[styles.statBox, styles.statBoxHighlight]}>
              <View style={styles.statHeader}>
                <Text style={[styles.statValue, { color: '#7B39FD' }]}>₦12,540,000</Text>
              </View>
              <Text style={styles.statLabel}>Auto Refund Amount</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {/* Box 3 */}
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Text style={styles.statValue}>45,000</Text>
                <View style={styles.arrowIconBg}>
                  <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
                </View>
              </View>
              <Text style={styles.statLabel}>Registered Guests</Text>
            </View>

            {/* Box 4 */}
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Text style={styles.statValue}>₦12,540,000</Text>
                <View style={styles.arrowIconBg}>
                  <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
                </View>
              </View>
              <Text style={styles.statLabel}>Pending Refunds</Text>
            </View>
          </View>
        </View>

        {/* Note Banner */}
        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            <Text style={{ fontWeight: '700' }}>Note:</Text> Cancellation notifications will be sent automatically to all attendees
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionBlock}>
          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={() => setConfirmVisible(true)}
          >
            <Text style={styles.cancelBtnText}>Cancel Event</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.keepBtn}
            onPress={() => router.replace('/dashboard')}
          >
            <Text style={styles.keepBtnText}>Keep Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <RNModal
        visible={confirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setConfirmVisible(false)}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.warningIconBg}>
              <Ionicons name="close" size={36} color="#FFF" />
            </View>

            <Text style={styles.modalTitle}>Cancel Event?</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to cancel this event? Attendees will be notified and ticket holders may be eligible for refunds.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => {
                  setConfirmVisible(false);
                  router.push('/dashboard/cancel-success');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel Event</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalKeepBtn}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalKeepText}>Keep Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  statsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 16,
    gap: 12,
    marginBottom: 25,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    height: 110,
    justifyContent: 'space-between',
  },
  statBoxHighlight: {
    borderColor: '#D2C0FF',
    backgroundColor: '#F3E8FF',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  arrowIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  noteBanner: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD166',
    borderRadius: 20,
    padding: 16,
    marginBottom: 40,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actionBlock: {
    gap: 15,
  },
  cancelBtn: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelBtnText: {
    color: '#FF4D4D',
    fontSize: 15,
    fontWeight: '700',
  },
  keepBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  modalCancelText: {
    color: '#FF4D4D',
    fontSize: 13,
    fontWeight: '700',
  },
  modalKeepBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalKeepText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
