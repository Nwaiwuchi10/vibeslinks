import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TICKET_TABS = ['General', 'VIP', 'VVIP'];

const CreateEventStep3 = ({ onBack, onContinue }: { onBack: () => void, onContinue: () => void }) => {
  const [activeTab, setActiveTab] = useState('VVIP');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Ticket Type</Text>
          <Text style={styles.headerSub}>Host can create multiple ticket types.</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {TICKET_TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab !== 'General' && (
           <TextInput placeholder="Ticket Name" style={styles.input} placeholderTextColor="#999" />
        )}
        <TextInput placeholder="Price" style={styles.input} keyboardType="numeric" placeholderTextColor="#999" />
        <TextInput placeholder="Quantity" style={styles.input} keyboardType="numeric" placeholderTextColor="#999" />

        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.benefitInput}>
           <TextInput placeholder="Text here" style={styles.innerInput} placeholderTextColor="#BBB" />
        </View>
        <View style={styles.benefitInput}>
           <TextInput placeholder="Text here" style={styles.innerInput} placeholderTextColor="#BBB" />
        </View>
        <View style={styles.benefitInput}>
           <TextInput placeholder="Text here" style={styles.innerInput} placeholderTextColor="#BBB" />
        </View>

        {activeTab === 'General' && (
           <TouchableOpacity style={styles.checkboxRow}>
             <View style={styles.checkbox} />
             <Text style={styles.checkboxLabel}>Free Entry</Text>
           </TouchableOpacity>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity>
           <Text style={styles.footerLink}>
             {activeTab === 'General' ? 'Create New Ticket' : 'Add More Ticket'}
           </Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
           <Text style={styles.continueText}>Save and continue</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventStep3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginRight: 40 },
  headerText: { alignItems: 'center', flex: 1, marginRight: 84 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  headerSub: { fontSize: 11, color: '#999', marginTop: 4 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#8E2DE2' },
  tabText: { fontSize: 13, color: '#999', fontWeight: '600' },
  tabTextActive: { color: '#8E2DE2', fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20 },
  input: { backgroundColor: '#FFF', borderRadius: 15, paddingHorizontal: 20, height: 60, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 15, marginTop: 10 },
  benefitInput: { backgroundColor: '#FFF', borderRadius: 15, paddingHorizontal: 20, height: 60, marginBottom: 12, justifyContent: 'center', elevation: 1 },
  innerInput: { fontSize: 14, color: '#333' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#8E2DE2', marginRight: 10 },
  checkboxLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 30, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  footerLink: { color: '#8E2DE2', fontSize: 15, fontWeight: '700' },
  continueBtn: { backgroundColor: '#7F36FF', height: 65, borderRadius: 32.5, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
