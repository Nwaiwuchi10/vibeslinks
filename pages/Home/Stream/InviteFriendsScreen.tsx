import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
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

export default function InviteFriendsScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

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
      .catch((err) => console.warn('Error loading followers:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleInvite = (id: string) => {
    setInvitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSent = invitedIds.has(item.id);
    return (
      <View style={styles.userRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            isSent ? styles.actionBtnSent : styles.actionBtnInvite,
          ]}
          onPress={() => toggleInvite(item.id)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.actionBtnText,
              isSent ? styles.actionBtnTextSent : styles.actionBtnTextInvite,
            ]}
          >
            {isSent ? 'Sent' : 'Invite'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <TouchableOpacity style={styles.copyLinkBtn} activeOpacity={0.8}>
          <Ionicons name="link-outline" size={16} color="#FFF" />
          <Text style={styles.copyLinkText}>Copy Link</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : friends.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>No followers found to invite.</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }) },
  headerTitle: { fontSize: 19, fontWeight: '700', color: '#1A1A1A', flex: 1, textAlign: 'center', marginHorizontal: 12 },
  copyLinkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, gap: 6 },
  copyLinkText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  listContent: { paddingTop: 10, paddingBottom: 40, paddingHorizontal: 20 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, backgroundColor: '#E0E0E0' },
  name: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111' },
  actionBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 6, minWidth: 80, alignItems: 'center' },
  actionBtnInvite: { backgroundColor: '#8E2DE2' },
  actionBtnSent: { backgroundColor: '#000' },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
  actionBtnTextInvite: { color: '#FFF' },
  actionBtnTextSent: { color: '#FFF' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 72 },
});
