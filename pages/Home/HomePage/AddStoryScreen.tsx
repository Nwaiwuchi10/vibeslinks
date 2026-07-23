import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

type GalleryItem = { id: string; uri: string; type: 'photo' | 'video' };

export default function AddStoryScreen() {
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Photos' | 'Videos'>('All');
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(true);

    // Load actual photos/videos from device media library
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                setLoadingGallery(false);
                return;
            }
            try {
                const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
                if (mediaStatus !== 'granted') {
                    setLoadingGallery(false);
                    return;
                }
                const assets = await MediaLibrary.getAssetsAsync({
                    mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
                    first: 60,
                    sortBy: MediaLibrary.SortBy.creationTime,
                });
                const items: GalleryItem[] = assets.assets.map((a) => ({
                    id: a.id,
                    uri: a.uri,
                    type: a.mediaType === MediaLibrary.MediaType.video ? 'video' : 'photo',
                }));
                setGalleryItems(items);
            } catch {
                setGalleryItems([]);
            } finally {
                setLoadingGallery(false);
            }
        })();
    }, []);

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow camera access to take a photo or video.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.85,
        });
        if (!result.canceled && result.assets[0]) {
            router.push({
                pathname: '/story-preview',
                params: { image: result.assets[0].uri, mediaType: result.assets[0].type || 'image' },
            });
        }
    };

    const filteredItems = galleryItems.filter((item) => {
        if (selectedFilter === 'Photos') return item.type === 'photo';
        if (selectedFilter === 'Videos') return item.type === 'video';
        return true;
    });

    const renderItem = ({ item }: { item: GalleryItem }) => (
        <TouchableOpacity
            style={styles.imageWrapper}
            onPress={() =>
                router.push({
                    pathname: '/story-preview',
                    params: { image: item.uri, mediaType: item.type },
                })
            }
            activeOpacity={0.8}
        >
            <Image source={{ uri: item.uri }} style={styles.gridImage} />
            {item.type === 'video' && (
                <View style={styles.videoOverlay}>
                    <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.85)" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add to Story</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={openCamera}>
                    <Ionicons name="camera-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.filtersContainer}>
                {(['All', 'Photos', 'Videos'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
                        onPress={() => setSelectedFilter(f)}
                    >
                        <Text style={[styles.filterText, selectedFilter === f && styles.filterTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={styles.cameraBtn} onPress={openCamera}>
                    <Ionicons name="camera" size={16} color="#FFF" />
                    <Text style={styles.cameraBtnText}>Camera</Text>
                </TouchableOpacity>
            </View>

            {loadingGallery ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8E2DE2" />
                    <Text style={styles.loadingText}>Loading your media...</Text>
                </View>
            ) : filteredItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="image-off-outline" size={48} color="#666" />
                    <Text style={styles.emptyText}>No media found</Text>
                    <TouchableOpacity style={styles.openCameraBtn} onPress={openCamera}>
                        <Ionicons name="camera" size={18} color="#FFF" />
                        <Text style={styles.openCameraBtnText}>Open Camera</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredItems}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#111',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 8,
    },
    filterChip: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    filterChipActive: {
        backgroundColor: '#8E2DE2',
    },
    filterText: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFF',
    },
    cameraBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E2DE2',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
    },
    cameraBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    imageWrapper: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.5,
        padding: 1,
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#AAA',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        fontWeight: '500',
    },
    openCameraBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E2DE2',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        gap: 8,
        marginTop: 8,
    },
    openCameraBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 15,
    },
});
