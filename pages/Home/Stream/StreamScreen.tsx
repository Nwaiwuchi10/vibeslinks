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
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: '1', name: 'Go Live', icon: 'video', color: '#8E2DE2' },
  { id: '2', name: 'Create Event', icon: 'file-document', color: '#0082FF' },
  { id: '3', name: 'Radio FM', icon: 'microphone-variant', color: '#6BB100' },
  { id: '4', name: 'Watch Stream', icon: 'television-play', color: '#FF006B' },
];

const STREAM_FEED = [
  { 
    id: '1', 
    user: 'Olivia', 
    likes: '1.1k', 
    type: 'Paid', 
    avatar: 'https://i.pravatar.cc/100?img=11', 
    image: require('../../../assets/images/artist_event.png') 
  },
  { 
    id: '2', 
    user: 'Roland', 
    likes: '9.4k', 
    type: 'Free', 
    avatar: 'https://i.pravatar.cc/100?img=12', 
    image: require('../../../assets/images/tiger_event.png') 
  },
];

const StreamScreen = ({ onBack, onCreateEventPress }: { onBack: () => void, onCreateEventPress: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stream</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <View key={action.id} style={styles.actionItem}>
              <TouchableOpacity 
                style={[styles.actionCircle, { backgroundColor: action.color }]}
                onPress={() => action.id === '2' ? onCreateEventPress() : null}
              >
                <MaterialCommunityIcons name={action.icon as any} size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.actionName}>{action.name}</Text>
            </View>
          ))}
        </View>

        {/* Ad Banner */}
        <TouchableOpacity style={styles.adBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000' }} 
            style={styles.adImage} 
          />
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.adOverlay}>
            <View style={styles.adHeader}>
              <View style={styles.adBadge}><Text style={styles.adBadgeText}>NIGHTLIFE</Text></View>
              <View style={styles.adSmallBadge}><Text style={styles.adSmallBadgeText}>Ad</Text></View>
            </View>
            <View style={styles.adFooter}>
              <Text style={styles.adTitle}>Worship De King <Ionicons name="arrow-forward-circle" size={16} /></Text>
              <Text style={styles.adPrice}>₦15,000</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Feed */}
        {STREAM_FEED.map((post) => (
          <View key={post.id} style={styles.feedCard}>
            <Image source={post.image} style={styles.feedImage} />
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.avatar }} style={styles.userAvatar} />
                <Text style={styles.userName}>{post.user}</Text>
                <View style={styles.likeInfo}>
                  <Ionicons name="heart" size={12} color="#FFF" />
                  <Text style={styles.likeText}>{post.likes}</Text>
                </View>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: post.type === 'Paid' ? '#8E2DE2' : '#7F36FF' }]}>
                <Text style={styles.typeText}>{post.type}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StreamScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  headerRight: { flexDirection: 'row' },
  iconBtn: { marginLeft: 15, width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionItem: { alignItems: 'center' },
  actionCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  actionName: { fontSize: 11, color: '#333', fontWeight: '700', marginTop: 10 },
  adBanner: { width: '100%', height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 25 },
  adImage: { ...StyleSheet.absoluteFillObject },
  adOverlay: { flex: 1, padding: 15, justifyContent: 'space-between' },
  adHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  adBadge: { backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  adBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  adSmallBadge: { backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  adSmallBadgeText: { fontSize: 8, fontWeight: '700', color: '#000' },
  adFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adTitle: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  adPrice: { color: '#FFF', fontWeight: '800', fontSize: 18 },
  feedCard: { width: '100%', height: 420, borderRadius: 30, overflow: 'hidden', marginBottom: 20, backgroundColor: '#EEE' },
  feedImage: { ...StyleSheet.absoluteFillObject },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 25 },
  userAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 13, marginRight: 8 },
  likeInfo: { flexDirection: 'row', alignItems: 'center' },
  likeText: { color: '#FFF', fontSize: 11, marginLeft: 4, fontWeight: '600' },
  typeBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  typeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
});
