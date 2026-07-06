import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

const GALLERY_IMAGES = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1615112196695-171542f53d4c?w=300' }, // Tiger
    { id: '2', uri: 'https://images.unsplash.com/photo-1605022600390-071c6ef3518a?w=300' }, // Red jacket
    { id: '3', uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300' }, // Guy smiling
    { id: '4', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300' }, // Guy poses
    { id: '5', uri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300' }, // Event setup
    { id: '6', uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300' }, // Cooking
    { id: '7', uri: 'https://images.unsplash.com/photo-1506825000545-7842b11b8b4e?w=300' }, // Guy with shades
    { id: '8', uri: 'https://images.unsplash.com/photo-1516280440502-86d7907f154e?w=300' }, // Microphone
    { id: '9', uri: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300' }, // Painting
    { id: '10', uri: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=300' },
    { id: '11', uri: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=300' },
    { id: '12', uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300' },
];

export default function AddStoryScreen() {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const renderItem = ({ item }: { item: typeof GALLERY_IMAGES[0] }) => (
        <TouchableOpacity 
            style={styles.imageWrapper}
            onPress={() => router.push({ pathname: '/story-preview', params: { image: item.uri } })}
            activeOpacity={0.8}
        >
            <Image source={{ uri: item.uri }} style={styles.gridImage} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add to Story</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="camera-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.filtersContainer}>
                <TouchableOpacity 
                    style={[styles.filterChip, selectedFilter === 'All' && styles.filterChipActive]}
                    onPress={() => setSelectedFilter('All')}
                >
                    <Text style={[styles.filterText, selectedFilter === 'All' && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.filterChip, selectedFilter === 'Photos' && styles.filterChipActive]}
                    onPress={() => setSelectedFilter('Photos')}
                >
                    <Text style={[styles.filterText, selectedFilter === 'Photos' && styles.filterTextActive]}>Photos</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.filterChip, selectedFilter === 'Videos' && styles.filterChipActive]}
                    onPress={() => setSelectedFilter('Videos')}
                >
                    <Text style={[styles.filterText, selectedFilter === 'Videos' && styles.filterTextActive]}>Videos</Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={styles.multipleBtn}>
                    <View style={styles.radioOutline} />
                    <Text style={styles.multipleText}>Select multiple</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={GALLERY_IMAGES}
                numColumns={3}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
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
        backgroundColor: '#666',
    },
    filterText: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFF',
    },
    multipleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    radioOutline: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#AAA',
        marginRight: 6,
    },
    multipleText: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '500',
    },
    imageWrapper: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.5,
        padding: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
});
