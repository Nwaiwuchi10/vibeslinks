import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userService } from '@/services/userService';

export default function BlockUsersScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutedIds, setMutedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    userService.getFollowers()
      .then((res) => {
        const list = Array.isArray(res) ? res : res.followers || res.items || [];
        setFriends(list.map((item: any) => ({
          id: item.id || item._id || String(Math.random()),
          name: item.name || item.fullName || item.username || 'User',
          avatar: item.avatarUrl || item.profilePictureUrl || `https://i.pravatar.cc/150?username=${item.username || 'user'}`,
        })));
      })
      .catch((err) => console.warn('Error loading followers for mute list:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setMutedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Block users</Text>
        <View style={{ width: 42 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : friends.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>No followers available to mute.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {friends.map((user) => {
            const isMuted = mutedIds.has(user.id);
            return (
              <View key={user.id} style={styles.userRow}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <Text style={styles.userName}>{user.name}</Text>
                <TouchableOpacity
                  style={[styles.actionBtn, isMuted ? styles.unmuteBtn : styles.muteBtn]}
                  onPress={() => toggle(user.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#F5F5F5' },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }) },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  listContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  userAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 14 },
  userName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
  actionBtn: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 10, minWidth: 80, alignItems: 'center' },
  muteBtn: { backgroundColor: '#E9174B' },
  unmuteBtn: { backgroundColor: '#111' },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
