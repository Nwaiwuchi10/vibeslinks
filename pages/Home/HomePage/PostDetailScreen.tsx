import React from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const COMMENTS = [
    { id: '1', name: 'commys_dairy', avatar: 'https://i.pravatar.cc/150?img=12', time: '.1h', text: 'Good night y\'all' },
    { id: '2', name: 'claudiocardoso', avatar: 'https://i.pravatar.cc/150?img=5', time: '.1h', text: 'Good night 000' },
];

export default function PostDetailScreen() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>VIBEZLINK</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="file-document-outline" size={22} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Post Content */}
                    <View style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.postAvatar} />
                            <View style={styles.postAuthorInfo}>
                                <Text style={styles.postName}>
                                    am_official_percy <MaterialIcons name="verified" size={14} color={Colors.primary} />
                                    <Text style={styles.postTime}> .2h</Text>
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.followBtn}>
                                <Text style={styles.followBtnText}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.postCaption}>it's Friday. Let party together</Text>
                        
                        <View style={styles.mediaContainer}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600' }} style={styles.postImage} />
                            <View style={styles.playOverlay}>
                                <View style={styles.playBtnOuter}>
                                    <Ionicons name="play" size={24} color="#8E2DE2" style={{ marginLeft: 3 }} />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.muteBtn}>
                                <Ionicons name="volume-mute" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.postActions}>
                            <View style={styles.actionItem}>
                                <Ionicons name="heart-outline" size={20} color="#8A8A8A" />
                                <Text style={styles.actionText}>441</Text>
                            </View>
                            <View style={styles.actionItem}>
                                <MaterialCommunityIcons name="comment-outline" size={20} color="#8A8A8A" />
                                <Text style={styles.actionText}>108</Text>
                            </View>
                            <View style={styles.actionItem}>
                                <Feather name="repeat" size={20} color="#8A8A8A" />
                                <Text style={styles.actionText}>63</Text>
                            </View>
                            <View style={styles.actionItem}>
                                <Feather name="send" size={20} color="#8A8A8A" />
                                <Text style={styles.actionText}>579</Text>
                            </View>
                        </View>
                    </View>

                    {/* Comments */}
                    <View style={styles.commentsSection}>
                        {COMMENTS.map((comment) => (
                            <View key={comment.id} style={styles.commentRow}>
                                <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                                <View style={styles.commentContent}>
                                    <View style={styles.commentHeader}>
                                        <Text style={styles.commentName}>
                                            {comment.name} <MaterialIcons name="verified" size={12} color={Colors.primary} />
                                            <Text style={styles.commentTime}> {comment.time}</Text>
                                        </Text>
                                        <TouchableOpacity>
                                            <MaterialCommunityIcons name="dots-horizontal" size={20} color="#000" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.commentText}>{comment.text}</Text>
                                    
                                    <View style={styles.commentActions}>
                                        <View style={styles.actionItem}>
                                            <Ionicons name="heart-outline" size={16} color="#8A8A8A" />
                                            <Text style={styles.actionTextSmall}>441</Text>
                                        </View>
                                        <View style={styles.actionItem}>
                                            <MaterialCommunityIcons name="comment-outline" size={16} color="#8A8A8A" />
                                            <Text style={styles.actionTextSmall}>108</Text>
                                        </View>
                                        <View style={styles.actionItem}>
                                            <Feather name="repeat" size={16} color="#8A8A8A" />
                                            <Text style={styles.actionTextSmall}>63</Text>
                                        </View>
                                        <View style={styles.actionItem}>
                                            <Feather name="send" size={16} color="#8A8A8A" />
                                            <Text style={styles.actionTextSmall}>579</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Input Bar */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Add your reply..."
                            placeholderTextColor="#888"
                        />
                    </View>
                    <TouchableOpacity style={styles.sendBtn}>
                        <Ionicons name="arrow-up" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
        letterSpacing: 1,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    postCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    postAuthorInfo: {
        flex: 1,
    },
    postName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    postTime: {
        fontSize: 13,
        color: '#888',
        fontWeight: '400',
    },
    followBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    followBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    postCaption: {
        fontSize: 15,
        color: '#333',
        marginBottom: 12,
    },
    mediaContainer: {
        width: '100%',
        height: 380,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtnOuter: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    muteBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#8A8A8A',
        fontWeight: '500',
    },
    commentsSection: {
        paddingHorizontal: 20,
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    commentName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    commentTime: {
        color: '#888',
        fontWeight: '400',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionTextSmall: {
        marginLeft: 4,
        fontSize: 12,
        color: '#8A8A8A',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FAFAFA',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 12,
    },
    input: {
        fontSize: 15,
        color: '#333',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
