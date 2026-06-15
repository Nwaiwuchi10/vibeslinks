import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const WEEKS = [
  ['', '1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '10', '11', '12', '13'],
  ['14', '15', '16', '17', '18', '19', '20'],
  ['21', '22', '23', '24', '25', '26', '27'],
  ['28', '29', '30', '', '', '', ''],
];

const CreateEventDatePicker = ({ onBack, onConfirm }: { onBack: () => void, onConfirm: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.monthTitle}>June 2026 <Ionicons name="chevron-forward" size={20} color="#8E2DE2" /></Text>
          <View style={styles.navRow}>
             <TouchableOpacity style={styles.navBtn}><Ionicons name="chevron-back" size={24} color="#8E2DE2" /></TouchableOpacity>
             <TouchableOpacity style={styles.navBtn}><Ionicons name="chevron-forward" size={24} color="#8E2DE2" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.daysRow}>
          {DAYS.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
        </View>

        {WEEKS.map((week, widx) => (
          <View key={widx} style={styles.weekRow}>
            {week.map((day, didx) => (
              <TouchableOpacity 
                key={didx} 
                style={[
                    styles.dateCell, 
                    day === '4' && styles.dateCellSelected,
                    (day === '22') && styles.dateCellHighlight
                ]}
              >
                <Text style={[
                    styles.dateText, 
                    day === '4' && styles.dateTextSelected,
                    (day === '22') && styles.dateTextHighlight
                ]}>
                    {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.timeSection}>
          <Text style={styles.timeTitle}>Time</Text>
          <View style={styles.timePickerRow}>
            <View style={styles.timeDisplay}>
              <Text style={styles.timeValueText}>11:38</Text>
            </View>
            <View style={styles.ampmToggle}>
               <TouchableOpacity style={styles.ampmBtnActive}><Text style={styles.ampmTextActive}>AM</Text></TouchableOpacity>
               <TouchableOpacity style={styles.ampmBtn}><Text style={styles.ampmText}>PM</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventDatePicker;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  monthTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  navRow: { flexDirection: 'row' },
  navBtn: { marginLeft: 15 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayLabel: { width: 40, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#BBB' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dateCell: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  dateCellSelected: { backgroundColor: '#F3E8FF' },
  dateCellHighlight: { },
  dateText: { fontSize: 18, fontWeight: '500', color: '#333' },
  dateTextSelected: { color: '#8E2DE2', fontWeight: '800' },
  dateTextHighlight: { color: '#8E2DE2' },
  timeSection: { marginTop: 40 },
  timeTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  timePickerRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  timeDisplay: { backgroundColor: '#F0F0F0', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginRight: 15 },
  timeValueText: { fontSize: 20, fontWeight: '600', color: '#333' },
  ampmToggle: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 4 },
  ampmBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  ampmBtnActive: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFF', elevation: 2 },
  ampmText: { fontSize: 13, color: '#999', fontWeight: '700' },
  ampmTextActive: { fontSize: 13, color: '#333', fontWeight: '800' },
  footer: { paddingHorizontal: 25, paddingBottom: 30 },
  confirmBtn: { backgroundColor: '#7F36FF', height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center' },
  confirmText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
