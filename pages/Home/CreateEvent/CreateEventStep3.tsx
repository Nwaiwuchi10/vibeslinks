import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateEvent, TicketTier } from './CreateEventContext';

const DEFAULT_TABS = ['General', 'VIP', 'VVIP'];
const DEFAULT_CURRENCIES = ['USD', 'NGN', 'GBP', 'EUR', 'CAD', 'GHS', 'KES', 'ZAR'];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  GBP: '£',
  EUR: '€',
  CAD: 'CA$',
  GHS: 'GH₵',
  KES: 'KSh',
  ZAR: 'R',
};

const CreateEventStep3 = ({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
  }) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'android' ? Math.max(insets.bottom, 16) : insets.bottom;
  const { eventData, updateEventData, options } = useCreateEvent();

  const ticketTabs = useMemo(() => {
    return options?.ticketTypeTabs && options.ticketTypeTabs.length > 0
      ? options.ticketTypeTabs
      : DEFAULT_TABS;
  }, [options]);

  const currencies = useMemo(() => {
    return options?.currencies && options.currencies.length > 0
      ? options.currencies
      : DEFAULT_CURRENCIES;
  }, [options]);

  const defaultCurrency = useMemo(() => {
    return options?.ticketForm?.defaultCurrency || 'USD';
  }, [options]);

  const [activeTab, setActiveTab] = useState(ticketTabs[0] || 'General');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  // Local state for each ticket tier
  const [generalTicket, setGeneralTicket] = useState<TicketTier>({
    tierName: 'General',
    price: 0,
    capacity: 100,
    description: '',
    currency: defaultCurrency,
    freeEntry: true,
  });

  const [vipTicket, setVipTicket] = useState<TicketTier>({
    tierName: 'VIP',
    price: 0,
    capacity: 50,
    description: '',
    currency: defaultCurrency,
    freeEntry: false,
  });

  const [vvipTicket, setVvipTicket] = useState<TicketTier>({
    tierName: 'VVIP',
    price: 0,
    capacity: 20,
    description: '',
    currency: defaultCurrency,
    freeEntry: false,
  });

  const [isFree, setIsFree] = useState(true);

  // Load existing tiers if present
  useEffect(() => {
    if (eventData.ticketTiers && eventData.ticketTiers.length > 0) {
      eventData.ticketTiers.forEach((tier) => {
        const name = tier.tierName || tier.ticketName;
        if (name === 'General') {
          setGeneralTicket(tier);
          if (tier.price === 0 || tier.freeEntry) setIsFree(true);
          else setIsFree(false);
          if (tier.currency) setSelectedCurrency(tier.currency);
        } else if (name === 'VIP') {
          setVipTicket(tier);
          if (tier.currency) setSelectedCurrency(tier.currency);
        } else if (name === 'VVIP') {
          setVvipTicket(tier);
          if (tier.currency) setSelectedCurrency(tier.currency);
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

  const handleCurrencyChange = (curr: string) => {
    setSelectedCurrency(curr);
    setGeneralTicket((prev) => ({ ...prev, currency: curr }));
    setVipTicket((prev) => ({ ...prev, currency: curr }));
    setVvipTicket((prev) => ({ ...prev, currency: curr }));
    setShowCurrencyModal(false);
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

  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

  const handleSaveAndContinue = () => {
    const finalTiers: TicketTier[] = [];

    // General tier (always included)
    const gen: TicketTier = {
      ...generalTicket,
      tierName: 'General',
      currency: selectedCurrency,
      price: isFree ? 0 : Number(generalTicket.price) || 0,
      freeEntry: isFree,
      capacity: Number(generalTicket.capacity) || 1,
      benefits: generalTicket.description ? generalTicket.description.split(', ').filter(Boolean) : [],
    };
    finalTiers.push(gen);

    // VIP tier (included if capacity or price is configured)
    if (vipTicket.price > 0 || vipTicket.capacity > 0) {
      finalTiers.push({
        ...vipTicket,
        tierName: 'VIP',
        currency: selectedCurrency,
        price: Number(vipTicket.price) || 0,
        freeEntry: false,
        capacity: Number(vipTicket.capacity) || 1,
        benefits: vipTicket.description ? vipTicket.description.split(', ').filter(Boolean) : [],
      });
    }

    // VVIP tier (included if capacity or price is configured)
    if (vvipTicket.price > 0 || vvipTicket.capacity > 0) {
      finalTiers.push({
        ...vvipTicket,
        tierName: 'VVIP',
        currency: selectedCurrency,
        price: Number(vvipTicket.price) || 0,
        freeEntry: false,
        capacity: Number(vvipTicket.capacity) || 1,
        benefits: vvipTicket.description ? vvipTicket.description.split(', ').filter(Boolean) : [],
      });
    }

    const calculatedTotalCapacity = finalTiers.reduce((sum, t) => sum + (t.capacity || 0), 0);

    updateEventData({
      ticketTiers: finalTiers,
      totalCapacity: Math.max(eventData.totalCapacity || 0, calculatedTotalCapacity),
    });
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
          <Text style={styles.headerSub}>Configure pricing, capacity, and benefits for each tier.</Text>
        </View>
      </View>

      {/* Currency Selection Bar */}
      <View style={styles.currencyRow}>
        <Text style={styles.currencyLabel}>Currency:</Text>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => setShowCurrencyModal(true)}
        >
          <Text style={styles.currencyText}>{selectedCurrency} ({currencySymbol})</Text>
          <Ionicons name="chevron-down" size={16} color="#8E2DE2" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {ticketTabs.map((tab) => (
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
              const nextVal = !isFree;
              setIsFree(nextVal);
              if (nextVal) {
                updateActiveTier({ price: 0, freeEntry: true });
              } else {
                updateActiveTier({ freeEntry: false });
              }
            }}
          >
            <View style={[styles.checkbox, isFree && styles.checkboxChecked]}>
              {isFree && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Free Entry (No Ticket Cost)</Text>
          </TouchableOpacity>
        )}

        {(!isFree || activeTab !== 'General') && (
          <View>
            <Text style={styles.inputLabel}>Price ({selectedCurrency} {currencySymbol})</Text>
            <TextInput
              placeholder="e.g. 50"
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
            placeholder="e.g. Front row seat / Access to stage"
            style={styles.innerInput}
            placeholderTextColor="#BBB"
            value={benefit1}
            onChangeText={(text) => updateBenefit(0, text)}
          />
        </View>
        <View style={styles.benefitInput}>
          <TextInput
            placeholder="e.g. Complimentary drink voucher"
            style={styles.innerInput}
            placeholderTextColor="#BBB"
            value={benefit2}
            onChangeText={(text) => updateBenefit(1, text)}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide" onRequestClose={() => setShowCurrencyModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCurrencyModal(false)}>
          <View style={[styles.modalSheet, { maxHeight: '60%' }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  style={[styles.modalOption, selectedCurrency === curr && styles.modalOptionSelected]}
                  onPress={() => handleCurrencyChange(curr)}
                >
                  <Text style={[styles.modalOptionText, selectedCurrency === curr && styles.modalOptionTextSelected]}>
                    {curr} ({CURRENCY_SYMBOLS[curr] || curr})
                  </Text>
                  {selectedCurrency === curr && <Ionicons name="checkmark-circle" size={20} color="#8E2DE2" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

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
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginRight: 20 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  headerSub: { fontSize: 12, color: '#666', marginTop: 4 },
  currencyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20, marginBottom: 12 },
  currencyLabel: { fontSize: 13, color: '#666', marginRight: 6, fontWeight: '600' },
  currencySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  currencyText: { fontSize: 13, color: '#8E2DE2', fontWeight: '700' },
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

  // Modal layout
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 30, maxHeight: '60%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDD', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', textAlign: 'center', marginBottom: 12, paddingHorizontal: 24 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  modalOptionSelected: { backgroundColor: '#F8F3FF' },
  modalOptionText: { fontSize: 15, color: '#333' },
  modalOptionTextSelected: { color: '#8E2DE2', fontWeight: '600' },
});
