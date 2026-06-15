import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          <Text style={styles.bodyText}>
            We work hard to make our use of personal data transparent and to make your rights and choices easy to understand. We added new details on how we build the models that support our products and services including those using generative artificial intelligence, how long we keep your information and changes to our international data transfer mechanisms.
            {"\n\n"}
            If you are outside of the EEA, Switzerland or the United Kingdom, we've outlined how we may share data with partners to allow advertisers to reach you on other websites and apps.
          </Text>

          <Text style={styles.sectionTitle}>Terms and Condition</Text>
          <Text style={styles.bodyText}>
            Anyone can see the public content you post, such as boards and pins you create, and public profile information you provide. Depending on where you live, we also make this public information available through what are called APIs (a technology tool to sharing information quickly).
            {"\n\n"}
            For example, a partner can study after their most popular pins are or how their Pins are being shared on Pinterest by using a Pinterest API. We also share the categories of information described below.
          </Text>

          <Text style={styles.sectionTitle}>Use of Application</Text>
          <Text style={styles.bodyText}>
            With law enforcement agencies, government agencies, and others in compliance with duty, rules, or regulations. For example, we may respond to requests information from law enforcement authorities like the police or courts.
            {"\n\n"}
            We only disclose information in response to such requests if we believe disclosure is reasonably necessary to comply with a law, regulation or legal request; to protect the safety, rights, or property of the public, any person, or Pinterest; or to detect, prevent, otherwise address fraud, security or technical issues.
          </Text>
        </View>
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  contentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 10,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
});
