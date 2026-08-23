import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { liveStreamService } from '@/services/liveStreamService';
import { socketService } from '@/services/socketService';

const { width } = Dimensions.get('window');

const DEFAULT_CATEGORIES = ['Music', 'DJ Session', 'Podcast', 'Event Stream', 'Interview', 'Nightlife', 'Gaming'];
const DEFAULT_PRIVACY = ['All', 'Public', 'Followers Only', 'Ticket Holders Only', 'Private Invite'];

export default function GoLiveScreen() {
    const params = useLocalSearchParams<{ mode?: 'voice' | 'camera' }>();
    
    const [streamTitle, setStreamTitle] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [audioMode, setAudioMode] = useState<'voice' | 'camera'>(params.mode || 'camera');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
    const [privacyOptions, setPrivacyOptions] = useState<string[]>(DEFAULT_PRIVACY);
    const [creating, setCreating] = useState(false);
    
    // Modal states
    const [category, setCategory] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    
    const [privacy, setPrivacy] = useState('');
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    useEffect(() => {
        if (params.mode) {
            setAudioMode(params.mode);
        }
    }, [params.mode]);

    useEffect(() => {
        liveStreamService.getCreateOptions()
            .then((data: any) => {
                if (data?.categories?.length) {
                    setCategories(data.categories.map((c: any) => c.label || c.name || c));
                }
                if (data?.privacyOptions?.length) {
                    setPrivacyOptions(data.privacyOptions.map((p: any) => p.label || p.name || p));
                }
            })
            .catch(() => {/* keep defaults */});
    }, []);

    const toggleMode = () => {
        setAudioMode(audioMode === 'voice' ? 'camera' : 'voice');
    };

    const pickCoverImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setCoverImage(result.assets[0].uri);
            }
        } catch (err) {
            console.warn('[GoLiveScreen] Pick image error:', err);
        }
    };

    const handleNext = async () => {
        if (creating) return;
        setCreating(true);
        try {
            const result = await liveStreamService.createStream({
                title: streamTitle.trim() || 'Live Session',
                category: category || categories[0] || 'Music',
                privacy: privacy || 'Public',
                ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
                coverUrl: coverImage || undefined,
            });
            const streamId =
                result?.liveStream?.id ||
                result?.id ||
                result?.stream?.id ||
                result?.data?.liveStream?.id ||
                result?.data?.id;

            // Connect socket in real-time
            socketService.connect();
            if (streamId) {
                socketService.joinRoom(`livestream:${streamId}`);
            }

            if (audioMode === 'camera') {
                router.push({
                    pathname: '/go-live-preview',
                    params: streamId ? { id: streamId } : undefined,
                });
            } else {
                router.push({
                    pathname: '/live-dashboard',
                    params: streamId ? { id: streamId } : undefined,
                });
            }
        } catch (error) {
            console.error('Failed to create stream:', error);
            if (audioMode === 'camera') {
                router.push('/go-live-preview');
            } else {
                router.push('/live-dashboard');
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Go live</Text>
                </View>
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
                    {/* Live Cover Picker */}
                    <View style={styles.coverPickerContainer}>
                        <TouchableOpacity style={styles.coverPickerCircle} activeOpacity={0.8} onPress={pickCoverImage}>
                            {coverImage ? (
                                <Image source={{ uri: coverImage }} style={styles.coverImagePreview} />
                            ) : (
                                <MaterialCommunityIcons name="image-plus" size={28} color="#FFF" />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.coverTitle}>Live Cover</Text>
                        <Text style={styles.coverSubtitle}>This becomes stream preview.</Text>
                    </View>

                    {/* Form Inputs */}
                    <View style={styles.formContainer}>
                        {/* Stream Title */}
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Stream Title"
                                placeholderTextColor="#7C808B"
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
                            <Text style={[styles.textInput, !category && { color: '#7C808B' }]}>
                                {category || 'Live Category'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Privacy Settings */}
                        <TouchableOpacity
                            style={styles.inputRow}
                            activeOpacity={0.8}
                            onPress={() => setShowPrivacyModal(true)}
                        >
                            <Text style={[styles.textInput, !privacy && { color: '#7C808B' }]}>
                                {privacy || 'Privacy Settings'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Ticket Price */}
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ticket Price"
                                placeholderTextColor="#7C808B"
                                value={ticketPrice}
                                onChangeText={setTicketPrice}
                                keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.feesText}>Fees 3%</Text>
                    </View>
                </ScrollView>

                {/* Bottom CTA Button */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.nextBtn}
                        activeOpacity={0.88}
                        onPress={handleNext}
                        disabled={creating}
                    >
                        {creating ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.nextBtnText}>
                                {audioMode === 'camera' ? 'Next' : 'Go LIVE'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Category Modal */}
            <Modal visible={showCategoryModal} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderTitle}>Select Category</Text>
                        {categories.map((cat: string, idx: number) => {
                            const isSelected = category === cat;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.modalOptionRow}
                                    onPress={() => {
                                        setCategory(cat);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, isSelected && { color: '#A78BFA', fontWeight: '700' }]}>
                                        {cat}
                                    </Text>
                                    {isSelected && <Ionicons name="checkmark" size={20} color="#A78BFA" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Privacy Modal */}
            <Modal visible={showPrivacyModal} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPrivacyModal(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderTitle}>Select Privacy</Text>
                        {privacyOptions.map((opt: string, idx: number) => {
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
                                    <Text style={[styles.modalOptionText, isSelected && { color: '#A78BFA', fontWeight: '700' }]}>
                                        {opt}
                                    </Text>
                                    {isSelected ? (
                                        <Ionicons name="checkmark-circle" size={22} color="#7C3AED" />
                                    ) : (
                                        <Ionicons name="radio-button-off" size={22} color="#6B7280" />
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
        backgroundColor: '#1E2024',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#2B2D33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
    },
    switchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    switchBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    
    // Cover Picker
    coverPickerContainer: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 32,
    },
    coverPickerCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#35383F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        overflow: 'hidden',
    },
    coverImagePreview: {
        width: '100%',
        height: '100%',
    },
    coverTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    coverSubtitle: {
        color: '#A485F6',
        fontSize: 13,
        fontWeight: '500',
    },

    // Form
    formContainer: {
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#282A30',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: Platform.OS === 'ios' ? 16 : 12,
        minHeight: 56,
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
        color: '#8E929E',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'right',
        marginTop: -4,
        marginBottom: 16,
        paddingRight: 4,
    },

    // Bottom Container
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 16 : 24,
        paddingTop: 12,
    },
    nextBtn: {
        backgroundColor: '#7C3AED',
        borderRadius: 28,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: '#2B2D33',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    modalHeaderTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    modalOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#3A3C44',
    },
    modalOptionText: {
        color: '#E5E7EB',
        fontSize: 15,
        fontWeight: '500',
    },
});
