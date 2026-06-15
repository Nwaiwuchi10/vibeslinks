import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const faqs = [
  { id: '1', question: 'Is my personal information secure?', answer: "Your personal info is safer than a Nigerian prince's email password 😂. Just kidding! More seriously, your data's encrypted and protected with bank-level security. Want details?" },
  { id: '2', question: 'Is there shear event details with friends?', answer: 'Yes, you can easily share details...' },
  { id: '3', question: 'How do i receive booking details?', answer: 'Booking details are sent to your email...' },
  { id: '4', question: 'How can i edit my profile information?', answer: 'Navigate to Your Profile screen...' },
  { id: '5', question: 'How filters works?', answer: 'Filters help you find specific events...' },
  { id: '6', question: 'How do i access my event perchance tickets?', answer: 'Go to your tickets tab...' },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('faqs');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#BBB" />
          <TextInput 
            placeholder="Search" 
            placeholderTextColor="#BBB"
            style={styles.searchInput}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'faqs' && styles.activeTab]}
            onPress={() => setActiveTab('faqs')}
          >
            <Text style={[styles.tabText, activeTab === 'faqs' && styles.activeTabText]}>FAQs</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
            onPress={() => setActiveTab('contact')}
          >
            <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'faqs' ? (
          <View style={styles.faqList}>
            {/* Category Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={{ paddingBottom: 10 }}>
               {['All', 'Service', 'General', 'Account', 'Others'].map((chip) => (
                 <TouchableOpacity 
                  key={chip} 
                  style={[styles.chip, chip === 'All' ? styles.activeChip : styles.inactiveChip]}
                >
                   <Text style={[styles.chipText, chip === 'All' && styles.activeChipText]}>{chip}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>

            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqHeader}
                  onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color={Colors.primary} 
                  />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.contactContainer}>
            {/* Contact options similar to design */}
            {[
              { id: '1', title: 'Customer Service', icon: 'account-outline' },
              { id: '2', title: 'Whatsapp', icon: 'logo-whatsapp', text: '+234 820 8402 719' },
              { id: '3', title: 'Website', icon: 'globe-outline' },
              { id: '4', title: 'Facebook', icon: 'logo-facebook' },
              { id: '5', title: 'Twiter (X)', icon: 'logo-twitter' },
              { id: '6', title: 'Instagram', icon: 'logo-instagram' },
              { id: '7', title: 'Instagram', icon: 'logo-instagram' },
            ].map((item) => (
              <TouchableOpacity key={item.id} style={styles.contactItem} onPress={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}>
                <View style={styles.contactContent}>
                  <View style={styles.contactMain}>
                    <View style={styles.contactLeft}>
                      <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
                      <Text style={styles.contactText}>{item.title}</Text>
                    </View>
                    <Ionicons 
                      name={expandedFaq === item.id ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color={Colors.primary} 
                    />
                  </View>
                  {item.text && expandedFaq === item.id && (
                    <Text style={styles.contactSubtext}>{item.text}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    height: 54,
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: Colors.primary,
  },
  faqList: {
    gap: 15,
  },
  chipsScroll: {
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  inactiveChip: {
    backgroundColor: '#F5F5F5',
    borderColor: 'transparent',
  },
  activeChip: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  activeChipText: {
    color: '#FFF',
  },
  faqItem: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 10,
  },
  faqBody: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  contactContainer: {
    gap: 15,
  },
  contactItem: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  contactContent: {
    gap: 10,
  },
  contactMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  contactSubtext: {
    fontSize: 14,
    color: '#999',
    marginLeft: 37,
  },
});
