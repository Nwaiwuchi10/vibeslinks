import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { eventService } from '@/services/eventService';
import { resolveImageUrl } from '@/services/apiClient';

export default function RecentSearchScreen() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        eventService.getEventSearchScreen()
            .then((data) => {
                let items: any[] = [];
                if (data?.recentViews && Array.isArray(data.recentViews) && data.recentViews.length > 0) {
                    items = data.recentViews;
                } else if (data?.recentSearches && Array.isArray(data.recentSearches) && data.recentSearches.length > 0) {
                    items = data.recentSearches;
                }
                
                if (items.length === 0) {
                    // Fallback to published events near you from database
                    return eventService.getEventsNearYou({ limit: 10 }).then((res) => {
                        const list = Array.isArray(res) ? res : res?.items || (res as any)?.data || [];
                        setResults(list);
                    });
                } else {
                    setResults(items);
                }
            })
            .catch((err) => {
                console.warn('[RecentSearchScreen] Error fetching search data:', err);
                return eventService.getEventsNearYou({ limit: 10 }).then((res) => {
                    const list = Array.isArray(res) ? res : res?.items || (res as any)?.data || [];
                    setResults(list);
                }).catch(() => setResults([]));
            })
            .finally(() => setLoading(false));
    }, []);

    const handleClearAll = () => {
        setResults([]);
    };

    const renderItem = ({ item }: { item: any }) => {
        const title = item.title || item.query || item.name || 'Event';
        const category = (item.category || 'EVENT').toUpperCase();
        const location = item.locationText || item.location || item.venue || 'Lagos, Nigeria';
        const price = item.priceText || (item.price !== undefined ? (Number(item.price) > 0 ? `₦${Number(item.price).toLocaleString()}` : 'Free') : 'Free');
        const rawImg = item.imageUrl || item.eventPosterUrl || item.image || item.coverUrl;
        const imageUri = resolveImageUrl(rawImg);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => {
                    if (item.id) {
                        router.push({ pathname: '/event-details', params: { id: item.id } });
                    }
                }}
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.cardImage} />
                ) : (
                    <Image source={require('../../../assets/images/redvive.png')} style={styles.cardImage} />
                )}
                
                <View style={styles.cardContent}>
                    <View style={styles.categoryPill}>
                        <Text style={styles.categoryText}>{category}</Text>
                    </View>
                    
                    <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                    
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color={Colors.primary || '#8E2DE2'} />
                        <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
                    </View>
                    
                    <Text style={styles.priceHighlight}>
                        {price} <Text style={styles.priceSub}>/Person</Text>
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recent Search</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary || '#8E2DE2'} />
                </View>
            ) : results.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={48} color="#CCC" />
                    <Text style={styles.emptyText}>No recent searches found</Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => item.id || String(index)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    clearAllText: {
        color: Colors.primary || '#8E2DE2',
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        marginTop: 12,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 40,
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardImage: {
        width: 120,
        height: 110,
        borderRadius: 12,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    categoryPill: {
        backgroundColor: '#000',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    categoryText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 13,
        color: '#8A8A8A',
        marginLeft: 4,
        fontWeight: '500',
        flex: 1,
    },
    priceHighlight: {
        fontSize: 15,
        color: Colors.primary || '#8E2DE2',
        fontWeight: '800',
    },
    priceSub: {
        fontSize: 13,
        color: '#8A8A8A',
        fontWeight: '500',
    },
});
