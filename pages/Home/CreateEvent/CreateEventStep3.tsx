import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateEvent, TicketTier } from './CreateEventContext';

const TICKET_TABS = ['General', 'VIP', 'VVIP'];

const CreateEventStep3 = ({ onBack, onContinue }: { onBack: () => void, onContinue: () => void }) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'android' ? Math.max(insets.bottom, 16) : insets.bottom;
  const [activeTab, setActiveTab] = useState('General');
  
  const { eventData, updateEventData } = useCreateEvent();
  
  // Local state for each ticket tier
  const [generalTicket, setGeneralTicket] = useState<TicketTier>({
    tierName: 'General',
    price: 0,
    capacity: 100,
    description: '',
    currency: 'NGN',
  });
  
  const [vipTicket, setVipTicket] = useState<TicketTier>({
    tierName: 'VIP',
    price: 0,
    capacity: 50,
    description: '',
    currency: 'NGN',
  });
  
  const [vvipTicket, setVvipTicket] = useState<TicketTier>({
    tierName: 'VVIP',
    price: 0,
    capacity: 20,
    description: '',
    currency: 'NGN',
  });

  const [isFree, setIsFree] = useState(false);

  // Load existing tiers if present
  useEffect(() => {
    if (eventData.ticketTiers && eventData.ticketTiers.length > 0) {
      eventData.ticketTiers.forEach((tier) => {
        if (tier.tierName === 'General') {
          setGeneralTicket(tier);
          if (tier.price === 0) setIsFree(true);
        } else if (tier.tierName === 'VIP') {
          setVipTicket(tier);
        } else if (tier.tierName === 'VVIP') {
          setVvipTicket(tier);
        }
      });
    }
  }, [eventData.ticketTiers]);

  // Helpers to get current active tier details
  const getActiveTier = () => {
    if (activeTab === 'General') return generalTicket;
    if (activeTab === 'VIP') return vipTicket;
    return vvipTicket;
  };

  const updateActiveTier = (fields: Partial<TicketTier>) => {
    if (activeTab === 'General') {
      setGeneralTicket((prev) => ({ ...prev, ...fields }));
    } else if (activeTab === 'VIP') {
      setVipTicket((prev) => ({ ...prev, ...fields }));
    } else {
      setVvipTicket((prev) => ({ ...prev, ...fields }));
    }
  };

  // Split description benefits
  const activeTier = getActiveTier();
  const benefits = activeTier.description ? activeTier.description.split(', ') : ['', ''];
  const benefit1 = benefits[0] || '';
  const benefit2 = benefits[1] || '';

  const updateBenefit = (index: number, val: string) => {
    const arr = [benefit1, benefit2];
    arr[index] = val;
    const desc = arr.filter(Boolean).join(', ');
    updateActiveTier({ description: desc });
  };

  const handleSaveAndContinue = () => {
    const finalTiers: TicketTier[] = [];

    // General tier (always included)
    const gen = { ...generalTicket };
    if (isFree) gen.price = 0;
    finalTiers.push(gen);

    // VIP tier (included if capacity or price is configured)
    if (vipTicket.price > 0 || vipTicket.capacity > 0) {
      finalTiers.push(vipTicket);
    }

    // VVIP tier (included if capacity or price is configured)
    if (vvipTicket.price > 0 || vvipTicket.capacity > 0) {
      finalTiers.push(vvipTicket);
    }

    updateEventData({ ticketTiers: finalTiers });
    onContinue();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Ticket Type</Text>
          <Text style={styles.headerSub}>Configure price and benefits for each tier.</Text>
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
        {activeTab === 'General' && (
          <TouchableOpacity 
            style={styles.checkboxRow} 
            activeOpacity={0.8}
            onPress={() => {
              setIsFree(!isFree);
              if (!isFree) {
                updateActiveTier({ price: 0 });
              }
            }}
          >
            <View style={[styles.checkbox, isFree && styles.checkboxChecked]}>
              {isFree && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Free Entry</Text>
          </TouchableOpacity>
        )}

        {(!isFree || activeTab !== 'General') && (
          <View>
            <Text style={styles.inputLabel}>Price (₦)</Text>
            <TextInput 
              placeholder="e.g. 5000" 
              style={styles.input} 
              keyboardType="numeric" 
              placeholderTextColor="#999" 
              value={activeTier.price > 0 ? activeTier.price.toString() : ''}
              onChangeText={(text) => updateActiveTier({ price: parseFloat(text) || 0 })}
            />
          </View>
        )}

        <View style={{ marginTop: 12 }}>
          <Text style={styles.inputLabel}>Ticket Quantity / Capacity</Text>
          <TextInput 
            placeholder="e.g. 100" 
            style={styles.input} 
            keyboardType="numeric" 
            placeholderTextColor="#999" 
            value={activeTier.capacity > 0 ? activeTier.capacity.toString() : ''}
            onChangeText={(text) => updateActiveTier({ capacity: parseInt(text, 10) || 0 })}
          />
        </View>

        <Text style={styles.sectionTitle}>Benefits & Perks</Text>
        <View style={styles.benefitInput}>
           <TextInput 
             placeholder="e.g. Front row seat" 
             style={styles.innerInput} 
             placeholderTextColor="#BBB" 
             value={benefit1}
             onChangeText={(text) => updateBenefit(0, text)}
           />
        </View>
        <View style={styles.benefitInput}>
           <TextInput 
             placeholder="e.g. Free drinks voucher" 
             style={styles.innerInput} 
             placeholderTextColor="#BBB" 
             value={benefit2}
             onChangeText={(text) => updateBenefit(1, text)}
           />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 20 + bottomPad }]}>
         <TouchableOpacity 
           style={styles.continueBtn} 
           onPress={handleSaveAndContinue}
         >
           <Text style={styles.continueText}>Save & Continue</Text>
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
  headerSub: { fontSize: 12, color: '#666', marginTop: 4 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
  tab: { flex: 1, height: 40, borderRadius: 20, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center' },
  tabActive: { backgroundColor: '#7F36FF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { height: 54, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#EAEAEA', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 15, marginBottom: 12 },
  benefitInput: { height: 50, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA', paddingHorizontal: 16, justifyContent: 'center', marginBottom: 12 },
  innerInput: { fontSize: 14, color: '#333' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#DDD', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#7F36FF', borderColor: '#7F36FF' },
  checkboxLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 15, backgroundColor: '#FAFAFA', borderTopWidth: 1, borderTopColor: '#EEE' },
  continueBtn: { backgroundColor: '#7F36FF', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  continueText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
