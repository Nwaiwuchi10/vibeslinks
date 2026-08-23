import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCreateEvent } from './CreateEventContext';

const CreateEventDatePicker = ({ onBack, onConfirm }: { onBack: () => void, onConfirm: () => void }) => {
  const { eventData, updateEventData } = useCreateEvent();

  // Current selections
  const [startDate, setStartDate] = useState<Date>(
    eventData.startsAt ? new Date(eventData.startsAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(
    eventData.endsAt ? new Date(eventData.endsAt) : new Date(Date.now() + 27 * 60 * 60 * 1000)
  );

  // Picker states
  const [activeMode, setActiveMode] = useState<'start' | 'end'>('start');
  const [pickerType, setPickerType] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios'); // iOS shows inline picker, Android on demand

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (!selectedDate) return;

    if (activeMode === 'start') {
      if (pickerType === 'date') {
        const nextDate = new Date(startDate);
        nextDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        setStartDate(nextDate);
        // On Android, chain to time picker for smooth UX
        if (Platform.OS === 'android') {
          setTimeout(() => {
            setPickerType('time');
            setShowPicker(true);
          }, 100);
        }
      } else {
        const nextDate = new Date(startDate);
        nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
        setStartDate(nextDate);
      }
    } else {
      if (pickerType === 'date') {
        const nextDate = new Date(endDate);
        nextDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        setEndDate(nextDate);
        if (Platform.OS === 'android') {
          setTimeout(() => {
            setPickerType('time');
            setShowPicker(true);
          }, 100);
        }
      } else {
        const nextDate = new Date(endDate);
        nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
        setEndDate(nextDate);
      }
    }
  };

  const openAndroidPicker = (mode: 'start' | 'end', type: 'date' | 'time') => {
    setActiveMode(mode);
    setPickerType(type);
    setShowPicker(true);
  };

  const handleConfirm = () => {
    updateEventData({
      startsAt: startDate.toISOString(),
      endsAt: endDate.toISOString(),
    });
    onConfirm();
  };

  const getActiveDate = () => {
    return activeMode === 'start' ? startDate : endDate;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
      </View>

      <View style={styles.content}>
        {/* Start Date Selection Row */}
        <Text style={styles.sectionLabel}>Event Start Time</Text>
        <View style={styles.selectorCard}>
          <TouchableOpacity 
            style={[styles.selectorBtn, activeMode === 'start' && pickerType === 'date' && styles.selectorBtnActive]}
            onPress={() => {
              setActiveMode('start');
              setPickerType('date');
              if (Platform.OS === 'android') openAndroidPicker('start', 'date');
            }}
          >
            <Ionicons name="calendar-outline" size={20} color="#8E2DE2" style={{ marginRight: 8 }} />
            <Text style={styles.selectorVal}>
              {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.selectorBtn, activeMode === 'start' && pickerType === 'time' && styles.selectorBtnActive]}
            onPress={() => {
              setActiveMode('start');
              setPickerType('time');
              if (Platform.OS === 'android') openAndroidPicker('start', 'time');
            }}
          >
            <Ionicons name="time-outline" size={20} color="#8E2DE2" style={{ marginRight: 8 }} />
            <Text style={styles.selectorVal}>
              {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* End Date Selection Row */}
        <Text style={styles.sectionLabel}>Event End Time</Text>
        <View style={styles.selectorCard}>
          <TouchableOpacity 
            style={[styles.selectorBtn, activeMode === 'end' && pickerType === 'date' && styles.selectorBtnActive]}
            onPress={() => {
              setActiveMode('end');
              setPickerType('date');
              if (Platform.OS === 'android') openAndroidPicker('end', 'date');
            }}
          >
            <Ionicons name="calendar-outline" size={20} color="#8E2DE2" style={{ marginRight: 8 }} />
            <Text style={styles.selectorVal}>
              {endDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.selectorBtn, activeMode === 'end' && pickerType === 'time' && styles.selectorBtnActive]}
            onPress={() => {
              setActiveMode('end');
              setPickerType('time');
              if (Platform.OS === 'android') openAndroidPicker('end', 'time');
            }}
          >
            <Ionicons name="time-outline" size={20} color="#8E2DE2" style={{ marginRight: 8 }} />
            <Text style={styles.selectorVal}>
              {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* iOS Date Picker Display */}
        {Platform.OS === 'ios' && showPicker && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>
              Setting {activeMode === 'start' ? 'Start' : 'End'} {pickerType === 'date' ? 'Date' : 'Time'}
            </Text>
            <DateTimePicker
              value={getActiveDate()}
              mode={pickerType}
              display="spinner"
              onChange={handleDateChange}
              textColor="#333"
              style={{ width: '100%', height: 180 }}
            />
          </View>
        )}

        {/* Android Date Picker Trigger */}
        {Platform.OS === 'android' && showPicker && (
          <DateTimePicker
            value={getActiveDate()}
            mode={pickerType}
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Confirm Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Date & Time</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventDatePicker;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 15, alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginRight: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#444', marginTop: 15, marginBottom: 8 },
  selectorCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: '#EEE', marginBottom: 15 },
  selectorBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginHorizontal: 4, borderRadius: 10, backgroundColor: '#F8F5FF' },
  selectorBtnActive: { backgroundColor: '#EFE5FF', borderWidth: 1, borderColor: '#8E2DE2' },
  selectorVal: { fontSize: 13, fontWeight: '700', color: '#333' },
  pickerContainer: { marginTop: 30, backgroundColor: '#FFF', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  pickerTitle: { fontSize: 14, fontWeight: '700', color: '#8E2DE2', marginBottom: 10 },
  footer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  confirmBtn: { backgroundColor: '#7F36FF', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  confirmText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
