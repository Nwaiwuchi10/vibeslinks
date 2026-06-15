import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const LIVE_CREATORS = [
    {
        id: '1',
        title: 'President Bola Ahmed Files for 3.5B Loan',
        username: 'Wazobia',
        viewerCount: '29.1K',
        timeAgo: '.2m',
        verified: true,
        image: require('../../assets/images/studio_mic.png'),
        avatar: 'https://i.pravatar.cc/150?img=11',
    },
    {
        id: '2',
        title: 'Join me with, me paint the art',
        username: 'Olivia',
        viewerCount: '1.9K',
        timeAgo: '.5m',
        verified: true,
        image: require('../../assets/images/artist_event.png'),
        avatar: 'https://i.pravatar.cc/150?img=20',
    },
    {
        id: '3',
        title: 'Join me with, me paint the art',
        username: 'Olivia',
        viewerCount: '41.6K',
        timeAgo: '.5m',
        verified: true,
        image: require('../../assets/images/tiger_event.png'),
        avatar: 'https://i.pravatar.cc/150?img=32',
    },
];

const LiveCreatorsListScreen = () => {
    const renderItem = ({ item }: { item: typeof LIVE_CREATORS[0] }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <ImageBackground source={item.image} style={styles.cardImage} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.cardOverlay}>
                    {/* Top Row Badges */}
                    <View style={styles.topBadges}>
                        <View style={styles.liveBadge}>
                            <View style={styles.dot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                        <View style={styles.viewerBadge}>
                            <Ionicons name="people-outline" size={14} color="#FFF" />
                            <Text style={styles.viewerText}>{item.viewerCount}</Text>
                        </View>
                    </View>

                    {/* Bottom Content */}
                    <View style={styles.cardBottom}>
                        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.creatorRow}>
                            <Image source={{ uri: item.avatar }} style={styles.smallAvatar} />
                            <Text style={styles.creatorName}>{item.username}</Text>
                            {item.verified && <MaterialIcons name="verified" size={12} color="#FFF" style={{ marginLeft: 4 }} />}
                            <Text style={styles.timeText}>{item.timeAgo}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Creators on Live</Text>

                <TouchableOpacity style={styles.headerIconButton}>
                    <Ionicons name="search-outline" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={LIVE_CREATORS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
            />

            {/* Bottom Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.findButton} activeOpacity={0.8} onPress={() => router.push('/event-near-you')}>
                    <Text style={styles.findButtonText}>Find Events</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LiveCreatorsListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    headerIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 110,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        height: 260,
        marginBottom: 20,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 24,
        padding: 12,
        justifyContent: 'space-between',
    },
    topBadges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF4B4B',
        marginRight: 4,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    viewerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    viewerText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFF',
        marginLeft: 4,
    },
    cardBottom: {
        paddingBottom: 4,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    creatorName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
        marginLeft: 6,
    },
    timeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginLeft: 4,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        paddingTop: 15,
        backgroundColor: 'rgba(249, 250, 251, 0.95)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    findButton: {
        backgroundColor: Colors.primary,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    findButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
