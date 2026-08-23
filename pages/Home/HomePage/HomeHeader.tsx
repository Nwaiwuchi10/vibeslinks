import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HomeHeaderProps {
  onAddPress: () => void;
  userAvatar?: string | null;
  userName?: string | null;
}

const HomeHeader = ({ onAddPress, userAvatar, userName }: HomeHeaderProps) => {
  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'VL';

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIconButton} onPress={onAddPress}>
        <Ionicons name="add" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.headerLogo}>VIBEZLINK</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={[styles.headerIconButton, { marginRight: 8 }]}
          onPress={() => router.push('/messages')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={20} color="#000" />
        </TouchableOpacity>
        {/* User avatar */}
        <TouchableOpacity
          style={[styles.headerIconButton, { marginLeft: 8 }]}
          onPress={() => router.push('/profile')}
        >
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 16,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  avatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8E2DE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
