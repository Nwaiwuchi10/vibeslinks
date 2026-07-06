import React, { useState } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatDetailScreen() {
    const params = useLocalSearchParams<{ id: string, name: string, image: string }>();
    const [message, setMessage] = useState('');

    const chatName = params.name || 'Roland Emmanuel';
    const chatImage = params.image || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150';

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header (Purple Background) */}
            <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="#8E2DE2" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleRow}>
                        <Image source={{ uri: chatImage }} style={styles.headerAvatar} />
                        <View>
                            <Text style={styles.headerName}>{chatName}</Text>
                            <Text style={styles.headerStatus}>Online</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.gridBtn} onPress={() => router.push({ pathname: '/chat-profile', params: { name: chatName, image: chatImage, isGroup: 'false' } })}>
                        <MaterialCommunityIcons name="dots-grid" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Chat Body (White rounded container) */}
            <View style={styles.chatBodyContainer}>
                <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
                    {/* Date Pill */}
                    <View style={styles.datePillWrapper}>
                        <View style={styles.datePill}>
                            <Text style={styles.dateText}>Today</Text>
                        </View>
                    </View>

                    {/* Received Message */}
                    <View style={styles.msgRowLeft}>
                        <View style={styles.msgBubbleLeft}>
                            <Text style={styles.msgTextLeft}>Hi good morning</Text>
                            <Text style={styles.msgTimeLeft}>11:19 AM</Text>
                        </View>
                    </View>

                    {/* Sent Message */}
                    <View style={styles.msgRowRight}>
                        <View style={styles.msgBubbleRight}>
                            <Text style={styles.msgTextRight}>How are u doing</Text>
                            <Text style={styles.msgTimeRight}>11:20 AM</Text>
                        </View>
                    </View>

                    {/* Received Event Card Message */}
                    <View style={styles.msgRowLeft}>
                        <View style={styles.eventCardBubble}>
                            <View style={styles.eventCardImageWrapper}>
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1615112196695-171542f53d4c?w=400' }} 
                                    style={styles.eventCardImage} 
                                />
                                <View style={styles.eventCardOverlay}>
                                    <View style={styles.eventCardBottomRow}>
                                        <Text style={styles.eventCardTitle}>The Lion King <Ionicons name="chevron-forward-circle" size={12} color="#FFF" /></Text>
                                        <Text style={styles.eventCardPrice}>₦15,000</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.eventCardFooter}>
                                <Text style={styles.msgTextLeft}>Are you going to this tour?</Text>
                                <Text style={styles.msgTimeLeft}>11:19 AM</Text>
                            </View>
                        </View>
                    </View>

                    {/* Sent Message */}
                    <View style={styles.msgRowRight}>
                        <View style={styles.msgBubbleRight}>
                            <Text style={styles.msgTextRight}>Yeye, am going with my kinds, have already paid for ticket reservation</Text>
                            <Text style={styles.msgTimeRight}>11:20 AM</Text>
                        </View>
                    </View>

                </ScrollView>

                {/* Input Bar */}
                <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                        
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Add your reply..."
                                placeholderTextColor="#A0A0A0"
                                value={message}
                                onChangeText={setMessage}
                                multiline
                            />
                        </View>
                        
                        <TouchableOpacity style={styles.sendBtn}>
                            <Ionicons name="arrow-up" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8E2DE2',
    },
    headerSafeArea: {
        backgroundColor: '#8E2DE2',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 12,
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 2,
    },
    headerStatus: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    gridBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatBodyContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    chatScroll: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
    },
    datePillWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    datePill: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dateText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    
    // Left Bubble
    msgRowLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    msgBubbleLeft: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    msgTextLeft: {
        fontSize: 14,
        color: '#333',
        marginRight: 12,
    },
    msgTimeLeft: {
        fontSize: 10,
        color: '#A0A0A0',
        marginTop: 4,
    },

    // Right Bubble
    msgRowRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    msgBubbleRight: {
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderTopRightRadius: 4,
        maxWidth: '80%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    msgTextRight: {
        fontSize: 14,
        color: '#FFF',
        marginRight: 12,
    },
    msgTimeRight: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },

    // Event Card
    eventCardBubble: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderTopLeftRadius: 4,
        maxWidth: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        overflow: 'hidden',
    },
    eventCardImageWrapper: {
        width: 250,
        height: 250,
        padding: 4,
    },
    eventCardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    eventCardOverlay: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        right: 4,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    eventCardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventCardTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    eventCardPrice: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '800',
    },
    eventCardFooter: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },

    // Input Area
    inputSafeArea: {
        backgroundColor: '#FAFAFA',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 0 : 12,
    },
    cameraBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 24,
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginRight: 10,
    },
    textInput: {
        fontSize: 15,
        color: '#333',
        maxHeight: 100,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
