import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function InviteFriendsMain() {
  const router = useRouter();

  const [friends, setFriends] = useState([
    { id: '1', name: 'Sophia Carter', image: require('@/assets/images/artist_event.png'), sent: false },
    { id: '2', name: 'Malik Johnson', image: require('@/assets/images/burna_boy.png'), sent: true },
    { id: '3', name: 'Elena Rossi', image: require('@/assets/images/dav.png'), sent: false },
    { id: '4', name: 'Hiroshi Tanaka', image: require('@/assets/images/davido.png'), sent: false },
    { id: '5', name: 'Amina Yusuf', image: require('@/assets/images/modu.png'), sent: false },
    { id: '6', name: 'Diego Morales', image: require('@/assets/images/odumodu.png'), sent: false },
    { id: '7', name: 'Priya Sharma', image: require('@/assets/images/skibi.png'), sent: true },
  ]);

  const toggleInvite = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, sent: !f.sent } : f))
    );
  };

  const renderItem = ({ item }: { item: typeof friends[0] }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={[styles.inviteButton, item.sent && styles.sentButton]}
        onPress={() => toggleInvite(item.id)}
      >
        <Text style={[styles.inviteButtonText, item.sent && styles.sentButtonText]}>
          {item.sent ? 'Sent' : 'Invite'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <TouchableOpacity style={styles.copyLinkBtn}>
          <Ionicons name="link-outline" size={16} color="#FFF" />
          <Text style={styles.copyLinkText}>Copy Link</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={friends}
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
    backgroundColor: '#FFF',
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
  copyLinkBtn: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  copyLinkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
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
    backgroundColor: '#7B39FD',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sentButton: {
    backgroundColor: '#000',
  },
  sentButtonText: {
    color: '#FFF',
  },
});
