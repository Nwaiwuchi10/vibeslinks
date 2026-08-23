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
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { userService } from '@/services/userService';
import { Colors } from '@/constants/Colors';

const APP_INVITE_LINK = 'https://vibeslink.app/invite';

export default function InviteFriendsMain() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        // Load followers as the "friends" to invite
        const data = await userService.getFollowers();
        const items = Array.isArray(data) ? data : [];
        setFriends(items);
      } catch (err) {
        console.warn('[InviteFriendsMain] Error loading friends:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFriends();
  }, []);

  const handleInvite = async (id: string) => {
    setInvitedIds((prev) => [...prev, id]);
    try {
      await Share.share({
        message: `Join me on VibesLink! ${APP_INVITE_LINK}`,
        url: APP_INVITE_LINK,
      });
    } catch (err) {
      // Silently handle share cancel
    }
  };

  const handleCopyLink = async () => {
    try {
      await Share.share({
        message: `Join me on VibesLink! ${APP_INVITE_LINK}`,
        url: APP_INVITE_LINK,
      });
    } catch (err) {
      // Silently handle share cancel
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const id = String(item.id || item.userId);
    const isSent = invitedIds.includes(id);
    const avatar = item.profilePictureUrl || item.avatarUrl;
    const displayName = item.fullName || item.name || item.username || 'User';

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.itemImage} />
          ) : (
            <View style={styles.itemImagePlaceholder}>
              <Text style={styles.itemImageInitial}>
                {displayName[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.itemName}>{displayName}</Text>
            {item.username && (
              <Text style={styles.itemUsername}>@{item.username}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.inviteButton, isSent && styles.sentButton]}
          onPress={() => handleInvite(id)}
          disabled={isSent}
        >
          <Text style={[styles.inviteButtonText, isSent && styles.sentButtonText]}>
            {isSent ? 'Sent' : 'Invite'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <TouchableOpacity style={styles.copyLinkBtn} onPress={handleCopyLink}>
          <Ionicons name="link-outline" size={16} color="#FFF" />
          <Text style={styles.copyLinkText}>Share Link</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-add-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No contacts to invite yet</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id || item.userId || Math.random())}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flex: 1,
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  itemImagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageInitial: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemUsername: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  inviteButton: {
    backgroundColor: '#7B39FD',
    paddingHorizontal: 22,
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
    backgroundColor: '#1A1A1A',
  },
  sentButtonText: {
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    marginTop: 10,
    fontWeight: '500',
  },
});
