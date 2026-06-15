import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const friendsList = [
  { id: '1', name: 'Sophia Carter', image: require('@/assets/images/artist_event.png') },
  { id: '2', name: 'Malik Johnson', image: require('@/assets/images/burna_boy.png') },
  { id: '3', name: 'Elena Rossi', image: require('@/assets/images/dav.png') },
  { id: '4', name: 'Hiroshi Tanaka', image: require('@/assets/images/davido.png') },
  { id: '5', name: 'Amina Yusuf', image: require('@/assets/images/modu.png') },
  { id: '6', name: 'Diego Morales', image: require('@/assets/images/odumodu.png') },
  { id: '7', name: 'Priya Sharma', image: require('@/assets/images/skibi.png') },
];

export default function InviteFriendsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof friendsList[0] }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <TouchableOpacity style={styles.inviteButton}>
        <Text style={styles.inviteButtonText}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={friendsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  inviteButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
