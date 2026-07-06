import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const CIRCLE_SIZE = (width - 48 - 40) / 3; // 3 cols with padding + gaps

const CATEGORIES = [
    'Music',
    'DJ Session',
    'Podcast',
    'Event Stream',
    'Interview',
];

const PRIVACY_OPTIONS = [
    'All',
    'Public',
    'Followers Only',
    'Ticket Holders Only',
    'Private Invite',
];

const GUESTS = [
    { id: '1', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=200' }, // Random male face
    { id: '2', avatar: null },
    { id: '3', avatar: null },
    { id: '4', avatar: null },
    { id: '5', avatar: null },
    { id: '6', avatar: null },
    { id: '7', avatar: null },
    { id: '8', avatar: null },
    { id: '9', avatar: null },
];

export default function GoLiveScreen() {
    const params = useLocalSearchParams<{ mode?: 'voice' | 'camera' }>();
    
    const [streamTitle, setStreamTitle] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [audioMode, setAudioMode] = useState<'voice' | 'camera'>(params.mode || 'camera');
    
    // Sync state if params change
    React.useEffect(() => {
        if (params.mode) {
            setAudioMode(params.mode);
        }
    }, [params.mode]);
    
    // Modal states
    const [category, setCategory] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    
    const [privacy, setPrivacy] = useState('All');
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const toggleMode = () => {
        setAudioMode(audioMode === 'voice' ? 'camera' : 'voice');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                    <Ionicons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Go live</Text>
                <TouchableOpacity
                    style={styles.switchBtn}
                    onPress={toggleMode}
                    activeOpacity={0.85}
                >
                    <MaterialCommunityIcons
                        name={audioMode === 'voice' ? 'camera' : 'waveform'}
                        size={16}
                        color="#FFF"
                    />
                    <Text style={styles.switchBtnText}>
                        {audioMode === 'voice' ? 'Switch to video' : 'Switch to audio'}
                    </Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {audioMode === 'camera' ? (
                        <>
                            {/* Live Cover Picker */}
                            <View style={styles.coverPickerContainer}>
                                <TouchableOpacity style={styles.coverPickerCircle} activeOpacity={0.8}>
                                    <MaterialCommunityIcons name="layers-plus" size={32} color="#FFF" />
                                </TouchableOpacity>
                                <Text style={styles.coverTitle}>Live Cover</Text>
                                <Text style={styles.coverSubtitle}>This becomes stream preview.</Text>
                            </View>

                            {/* Stream Title */}
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Stream Title"
                                    placeholderTextColor="#9CA3AF"
                                    value={streamTitle}
                                    onChangeText={setStreamTitle}
                                />
                            </View>

                            {/* Live Category */}
                            <TouchableOpacity
                                style={styles.inputRow}
                                activeOpacity={0.8}
                                onPress={() => setShowCategoryModal(true)}
                            >
                                <Text style={[styles.textInput, !category && { color: '#9CA3AF' }]}>
                                    {category || 'Live Category'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#FFF" />
                            </TouchableOpacity>

                            {/* Privacy Settings */}
                            <TouchableOpacity
                                style={styles.inputRow}
                                activeOpacity={0.8}
                                onPress={() => setShowPrivacyModal(true)}
                            >
                                <Text style={[styles.textInput, !privacy && { color: '#9CA3AF' }]}>
                                    {privacy ? privacy : 'Privacy Settings'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#FFF" />
                            </TouchableOpacity>

                            {/* Ticket Price */}
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Ticket Price"
                                    placeholderTextColor="#9CA3AF"
                                    value={ticketPrice}
                                    onChangeText={setTicketPrice}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Text style={styles.feesText}>Fees 3%</Text>
                        </>
                    ) : (
                        <>
                            {/* Voice Mode Content */}
                            <View style={{ height: 24 }} />
                            
                            {/* Stream Title */}
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Stream Title"
                                    placeholderTextColor="#9CA3AF"
                                    value={streamTitle}
                                    onChangeText={setStreamTitle}
                                />
                            </View>
                            
                            {/* Ticket Price */}
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Ticket Price"
                                    placeholderTextColor="#9CA3AF"
                                    value={ticketPrice}
                                    onChangeText={setTicketPrice}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Text style={styles.feesText}>Fees 3%</Text>

                            {/* 3x3 Grid */}
                            <View style={styles.guestGrid}>
                                {GUESTS.map((guest, index) => (
                                    <TouchableOpacity 
                                        key={guest.id} 
                                        style={styles.guestCircle}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/invite-friends')}
                                    >
                                        {guest.avatar ? (
                                            <Image source={{ uri: guest.avatar }} style={styles.guestAvatar} />
                                        ) : (
                                            <Ionicons name="person" size={CIRCLE_SIZE * 0.45} color="#5A5A5A" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </ScrollView>

                {/* Bottom CTA */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.goLiveBtn}
                        activeOpacity={0.85}
                        onPress={() => router.push(audioMode === 'camera' ? '/go-live-preview' : '/live-dashboard')}
                    >
                        <Text style={styles.goLiveBtnText}>
                            {audioMode === 'camera' ? 'Next' : 'Go LIVE'}
                        </Text>
                    </TouchableOpacity>

                    {/* Toggle bar - Only shown in Voice mode as per screenshot */}
                    {audioMode === 'voice' && (
                        <View style={styles.toggleBar}>
                            <TouchableOpacity
                                style={styles.toggleItem}
                                onPress={() => setAudioMode('voice')}
                            >
                                <MaterialCommunityIcons
                                    name="phone-in-talk"
                                    size={16}
                                    color="#FFF"
                                />
                                <Text style={[styles.toggleText, styles.toggleTextActive]}>
                                    Voice Chart
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.toggleItem}
                                onPress={() => setAudioMode('camera')}
                            >
                                <MaterialCommunityIcons
                                    name="camera"
                                    size={16}
                                    color="rgba(255,255,255,0.5)"
                                />
                                <Text style={styles.toggleText}>
                                    Device Camera
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Category Modal */}
            <Modal visible={showCategoryModal} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
                    <View style={styles.modalContent}>
                        {CATEGORIES.map((cat, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.modalOption}
                                onPress={() => {
                                    setCategory(cat);
                                    setShowCategoryModal(false);
                                }}
                            >
                                <Text style={styles.modalOptionText}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Privacy Modal */}
            <Modal visible={showPrivacyModal} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPrivacyModal(false)}>
                    <View style={styles.modalContent}>
                        {PRIVACY_OPTIONS.map((opt, idx) => {
                            const isSelected = privacy === opt;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.modalOptionRow}
                                    onPress={() => {
                                        setPrivacy(opt);
                                        setShowPrivacyModal(false);
                                    }}
                                >
                                    <Text style={styles.modalOptionText}>{opt}</Text>
                                    {isSelected ? (
                                        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                    ) : (
                                        <Ionicons name="radio-button-off" size={24} color="#FFF" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#3E3E3E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    switchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    switchBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    
    // Cover Picker
    coverPickerContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    coverPickerCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#5A5A5A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    coverTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    coverSubtitle: {
        color: '#A78BFA',
        fontSize: 13,
        fontWeight: '500',
    },

    // Inputs
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#313131',
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: Platform.OS === 'ios' ? 18 : 14,
        minHeight: 58,
        marginBottom: 14,
    },
    textInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 15,
        fontWeight: '500',
        padding: 0,
    },
    feesText: {
        color: '#D1D5DB',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'right',
        marginBottom: 24,
    },

    // Grid (Voice Mode)
    guestGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    guestCircle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: '#313131',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    guestAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: CIRCLE_SIZE / 2,
    },
    
    // Bottom
    bottomContainer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 16 : 24,
        paddingTop: 16,
    },
    goLiveBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 12,
    },
    goLiveBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
    
    // Toggle Bar
    toggleBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 6,
    },
    toggleText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#FFF',
    },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#9CA3AF',
        borderRadius: 16,
        paddingVertical: 10,
    },
    modalOption: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    modalOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    modalOptionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
});
