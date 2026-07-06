import React, { useState } from 'react';
import {
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

const INITIAL_RESULTS = [
    {
        id: '1',
        title: 'Afro Summer Festival',
        category: 'NIGHTLIFE',
        location: 'Lekki Ikata, Lagos',
        price: '₦80,000',
        image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=400',
    },
    {
        id: '2',
        title: 'Worship De King',
        category: 'FESTIVALS',
        location: 'Lekki Ikata, Lagos',
        price: '₦15,000',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400',
    },
    {
        id: '3',
        title: 'Afro Summer Festival',
        category: 'SPORTS EVENTS',
        location: 'Lekki Ikata, Lagos',
        price: '₦80,000',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400',
    },
    {
        id: '4',
        title: 'Paint With Mimi, &...',
        category: 'COMEDY',
        location: 'Lekki Ikata, Lagos',
        price: '₦80,000',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400',
    },
];

export default function RecentSearchScreen() {
    const [results, setResults] = useState(INITIAL_RESULTS);

    const renderItem = ({ item }: { item: typeof INITIAL_RESULTS[0] }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            
            <View style={styles.cardContent}>
                <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={Colors.primary} />
                    <Text style={styles.locationText}>{item.location}</Text>
                </View>
                
                <Text style={styles.priceHighlight}>
                    {item.price} <Text style={styles.priceSub}>/Person</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recent Search</Text>
                <TouchableOpacity onPress={() => setResults([])}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
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
        width: 140,
        height: 120,
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
    },
    priceHighlight: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '800',
    },
    priceSub: {
        fontSize: 13,
        color: '#8A8A8A',
        fontWeight: '500',
    },
});
