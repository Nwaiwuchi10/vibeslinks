import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function ChatMain() {
  const router = useRouter();
  const [broadcastVisible, setBroadcastVisible] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7B39FD" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <Image
            source={require('@/assets/images/davido.png')}
            style={styles.groupAvatar}
          />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>The lion King</Text>
            <View style={styles.activeRow}>
              <MaterialCommunityIcons name="account-group" size={14} color="#E0D0FF" />
              <Text style={styles.activeText}>30 . 9 active now</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.gridButton} onPress={() => setBroadcastVisible(true)}>
          <Ionicons name="apps" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Message Feed */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Today Separator */}
          <View style={styles.todayContainer}>
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          </View>

          {/* Message 1 (Iria) */}
          <View style={styles.messageRow}>
            <Image
              source={require('@/assets/images/artist_event.png')}
              style={styles.userAvatar}
            />
            <View style={styles.messageBubble}>
              <Text style={styles.senderName}>Iria</Text>
              <Text style={styles.messageText}>
                Welcome Roland our UI/UX expert to the group. thank you
              </Text>
              <Text style={styles.timestamp}>11:19 AM</Text>
            </View>
          </View>

          {/* Message 2 (Iria continued) */}
          <View style={styles.messageRow}>
            <Image
              source={require('@/assets/images/artist_event.png')}
              style={[styles.userAvatar, { opacity: 0 }]} // Keep alignment but hide avatar for consecutive messages
            />
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                Let’s schedule to meet sometime on Monday as a group. Let me know what time works for everyone
              </Text>
              <Text style={styles.timestamp}>11:19 AM</Text>
            </View>
          </View>

          {/* Message 3 (Adevibes with Tiger Image card) */}
          <View style={styles.messageRow}>
            <View style={[styles.userAvatar, styles.avatarPlaceholder]}>
              <Text style={styles.placeholderInitials}>AD</Text>
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.senderName}>Adevibes</Text>
              
              {/* Event card attachment */}
              <View style={styles.imageCard}>
                <Image
                  source={require('@/assets/images/tiger_event.png')}
                  style={styles.cardImg}
                  contentFit="cover"
                />
                <View style={styles.imageCardOverlay} />
                <View style={styles.imageCardInfo}>
                  <TouchableOpacity style={styles.imageCardLink}>
                    <Text style={styles.imageCardTitle}>The Lion King</Text>
                    <Ionicons name="arrow-forward-circle" size={14} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.imageCardPrice}>₦15,000</Text>
                </View>
              </View>

              <Text style={styles.messageText}>Hi guys have seen this?</Text>
              <Text style={styles.timestamp}>11:19 AM</Text>
            </View>
          </View>

          {/* Message 4 (Current user reply/quote style) */}
          <View style={styles.rightMessageRow}>
            <View style={styles.rightMessageBubble}>
              {/* Quoted Reply Part */}
              <View style={styles.quotedContainer}>
                <Text style={styles.quotedSender}>Iria</Text>
                <Text style={styles.quotedText} numberOfLines={1}>
                  Welcome Roland our UI/UX expert to the group. thank you
                </Text>
              </View>
              
              <Text style={styles.rightMessageText}>
                Welcome Roland our UI/UX expert to the group. thank you
              </Text>
              <Text style={styles.rightTimestamp}>11:19 AM</Text>
            </View>
          </View>
        </ScrollView>

        {/* Input Composer Bar */}
        <View style={styles.composerBar}>
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Add your reply..."
              placeholderTextColor="#A0A0A0"
              style={styles.replyInput}
            />
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="arrow-up" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Send Broadcast Modal Overlay */}
      <Modal
        visible={broadcastVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBroadcastVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send broadcast</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setBroadcastVisible(false)}
              >
                <Ionicons name="close" size={18} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Type here..."
              placeholderTextColor="#A0A0A0"
              multiline={true}
              style={styles.broadcastInput}
              value={broadcastText}
              onChangeText={setBroadcastText}
            />

            <TouchableOpacity 
              style={styles.sendBroadcastBtn}
              onPress={() => {
                setBroadcastVisible(false);
                setBroadcastText('');
              }}
            >
              <Text style={styles.sendBroadcastText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    height: 70,
    backgroundColor: '#7B39FD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  groupInfo: {
    justifyContent: 'center',
  },
  groupName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  activeText: {
    color: '#E0D0FF',
    fontSize: 11,
    fontWeight: '500',
  },
  gridButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
  },
  todayContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  todayBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  messageRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderInitials: {
    color: '#7B39FD',
    fontSize: 12,
    fontWeight: '700',
  },
  messageBubble: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B39FD',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 9,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 6,
    fontWeight: '500',
  },
  imageCard: {
    width: 220,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  imageCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  imageCardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageCardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  imageCardTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  imageCardPrice: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rightMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  rightMessageBubble: {
    backgroundColor: '#7B39FD',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  quotedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFF',
  },
  quotedSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  quotedText: {
    fontSize: 11,
    color: '#E0D0FF',
  },
  rightMessageText: {
    fontSize: 13,
    color: '#FFF',
    lineHeight: 18,
  },
  rightTimestamp: {
    fontSize: 9,
    color: '#E0D0FF',
    alignSelf: 'flex-end',
    marginTop: 6,
    fontWeight: '500',
  },
  composerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAF9FF',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    gap: 8,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  replyInput: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  broadcastInput: {
    height: 120,
    backgroundColor: '#FAF9FF',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#F0F0F5',
    marginBottom: 20,
  },
  sendBroadcastBtn: {
    backgroundColor: '#2E2E35',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBroadcastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
