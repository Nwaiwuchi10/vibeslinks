import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreateEventPreview = ({ onBack, onPublish }: { onBack: () => void, onPublish: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Ticket Type</Text>
          <View style={styles.typeCard}>
            <View style={styles.typeIconContainer}>
              <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#8E2DE2" />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.typeTitle}>Physical Event</Text>
              <Text style={styles.typeDesc}>Host fans in person at a venue</Text>
            </View>
            <View style={styles.radioOutter}>
              <View style={styles.radioInner} />
            </View>
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Title</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>AFRO VIBES FESTIVAL 2026</Text>
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Description</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Experience the biggest Afrobeat nightlife event with live DJs, celebrity appearances, and exclusive performances.
            </Text>
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Featured Artists</Text>
          <View style={styles.artistBox}>
             <View style={styles.artistInput}><Text style={styles.artistInputText}>Burna Boy</Text></View>
             <View style={styles.artistInput}><Text style={styles.artistInputText}>Pop</Text></View>
             <View style={styles.artistInput}><Text style={styles.artistInputText}>287755700007543.png</Text></View>
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Time and Date</Text>
          <View style={styles.dateTimeBox}>
            <View style={styles.infoBox}><Text style={styles.infoText}>29 / 05 / 2026</Text></View>
            <View style={styles.timeRow}>
              <View style={styles.timeBox}>
                <Text style={styles.infoText}>9:00PM</Text>
                <Ionicons name="time-outline" size={18} color="#8E2DE2" />
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.infoText}>4:00AM</Text>
                <Ionicons name="time-outline" size={18} color="#8E2DE2" />
              </View>
            </View>
            <View style={styles.infoBox}><Text style={styles.infoText}>West Africa time</Text></View>
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Cover</Text>
          <Image 
            source={require('../../../assets/images/burna_boy.png')} 
            style={styles.coverImage} 
          />
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Venue</Text>
          <View style={styles.venueBox}>
            <View style={styles.infoBox}><Text style={styles.infoText}>Jafa Hotel</Text></View>
            <View style={styles.infoBox}><Text style={styles.infoText}>Awoyaya, Ibeju Lekki Lagos Nigeria</Text></View>
            <View style={styles.infoBox}><Text style={[styles.infoText, { color: '#8E2DE2' }]}>https://maps.app.goo.gl/ezq7MN7PG8...</Text></View>
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Ticket Type</Text>
          <View style={styles.ticketTypeBox}>
            {['VIP', '20,000', 'Lounge access', 'Free drinks', 'Priority entry'].map((text, idx) => (
              <View key={idx} style={styles.ticketInfoBox}>
                <Text style={styles.infoText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftBtn}>
          <Text style={[styles.btnText, { color: '#8E2DE2' }]}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishBtn} onPress={onPublish}>
          <Text style={[styles.btnText, { color: '#FFF' }]}>Publish Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventPreview;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  editBtn: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  editBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  previewSection: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  typeCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#8E2DE2', alignItems: 'center' },
  typeIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  typeTitle: { fontSize: 15, fontWeight: '800', color: '#1E1E1E' },
  typeDesc: { fontSize: 11, color: '#666', marginTop: 4 },
  radioOutter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#8E2DE2' },
  infoBox: { backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 18, marginBottom: 10 },
  infoText: { fontSize: 13, color: '#999', fontWeight: '500' },
  artistBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 10 },
  artistInput: { backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 8 },
  artistInputText: { fontSize: 12, color: '#999' },
  dateTimeBox: { width: '100%' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  timeBox: { width: '48%', height: 55, backgroundColor: '#F8F8F8', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  coverImage: { width: '100%', height: 200, borderRadius: 20 },
  venueBox: { width: '100%' },
  ticketTypeBox: { width: '100%' },
  ticketInfoBox: { backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 8 },
  bottomBar: { position: 'absolute', bottom: 30, left: 20, right: 20, height: 75, backgroundColor: '#FFF', borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  draftBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  publishBtn: { flex: 1.5, height: 55, backgroundColor: '#7F36FF', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});
