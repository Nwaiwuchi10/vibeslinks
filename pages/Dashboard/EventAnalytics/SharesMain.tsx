import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hostService } from '@/services/hostService';
import UserAvatar from '@/components/UserAvatar';

export default function SharesMain() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [loading, setLoading] = useState(true);
  const [sharesList, setSharesList] = useState<any[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    hostService.getShares(eventId, 'allTime')
      .then((data: any) => {
        const list: any[] = data?.users || data?.shares || data?.items || [];
        setSharesList(list);
        setTotal(data?.total ?? data?.count ?? data?.summary?.sharesCount ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  const renderItem = ({ item }: { item: any }) => {
    const name = item.fullName || item.name || item.username || 'User';
    const avatarUrl = item.profilePictureUrl || item.avatarUrl || null;
    const sharedAt = item.sharedAt || item.createdAt
      ? new Date(item.sharedAt || item.createdAt).toLocaleDateString()
      : null;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <UserAvatar avatarUrl={avatarUrl} name={name} size={50} />
          <View style={styles.nameCol}>
            <Text style={styles.itemName}>{name}</Text>
            {sharedAt && <Text style={styles.sharedDate}>{sharedAt}</Text>}
          </View>
        </View>
        <View style={styles.sharedBadge}>
          <Text style={styles.sharedBtnText}>Shared</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Shares{total !== null ? ` (${Number(total).toLocaleString()})` : ''}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#7B39FD" style={{ flex: 1 }} />
      ) : sharesList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="paper-plane-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No shares yet</Text>
        </View>
      ) : (
        <FlatList
          data={sharesList}
          renderItem={renderItem}
          keyExtractor={(item, idx) => item.id || String(idx)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  nameCol: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', flexShrink: 1 },
  sharedDate: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  sharedBadge: {
    backgroundColor: '#7B39FD',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  sharedBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#BBB', fontSize: 14, marginTop: 8 },
});
