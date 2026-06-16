import React from 'react';
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

export default function SharesMain() {
  const router = useRouter();

  const sharesList = [
    { id: '1', name: 'Sophia Carter', image: require('@/assets/images/artist_event.png') },
    { id: '2', name: 'Malik Johnson', image: require('@/assets/images/burna_boy.png') },
    { id: '3', name: 'Elena Rossi', image: require('@/assets/images/dav.png') },
    { id: '4', name: 'Hiroshi Tanaka', image: require('@/assets/images/davido.png') },
    { id: '5', name: 'Amina Yusuf', image: require('@/assets/images/modu.png') },
    { id: '6', name: 'Diego Morales', image: require('@/assets/images/odumodu.png') },
    { id: '7', name: 'Priya Sharma', image: require('@/assets/images/skibi.png') },
  ];

  const renderItem = ({ item }: { item: typeof sharesList[0] }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <TouchableOpacity style={styles.shearedBtn}>
        <Text style={styles.shearedBtnText}>Sheared</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shares</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={sharesList}
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
    backgroundColor: '#FAF9FF',
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  shearedBtn: {
    backgroundColor: '#7B39FD',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  shearedBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
