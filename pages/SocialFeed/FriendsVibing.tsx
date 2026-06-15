import React from 'react';
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

const FRIENDS = [
    { id: '1', name: 'Sophia Carter', avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: '2', name: 'Malik Johnson', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '3', name: 'Elena Rossi', avatar: 'https://i.pravatar.cc/150?img=45' },
    { id: '4', name: 'Hiroshi Tanaka', avatar: 'https://i.pravatar.cc/150?img=52' },
    { id: '5', name: 'Amina Yusuf', avatar: 'https://i.pravatar.cc/150?img=49' },
    { id: '6', name: 'Diego Morales', avatar: 'https://i.pravatar.cc/150?img=68' },
    { id: '7', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=41' },
];

const FriendsVibingScreen = () => {
    const renderItem = ({ item }: { item: typeof FRIENDS[0] }) => (
        <TouchableOpacity style={styles.friendItem} activeOpacity={0.7}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.friendName}>{item.name}</Text>
            <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="book-open-outline" size={20} color="#1A1A2E" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Friends Attending Event</Text>
                    <Text style={styles.headerSubtitle}>See where your friends are vibing this weekend.</Text>
                </View>
            </View>

            <FlatList
                data={FRIENDS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* Bottom Button Area */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.buyButton} activeOpacity={0.8} onPress={() => router.push('/event-details')}>
                    <Text style={styles.buyButtonText}>Buy Tickets</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FriendsVibingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
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
    headerTitleContainer: {
        flex: 1,
        marginLeft: 15,
        alignItems: 'center',
        marginRight: 44, // Offset for back button to center title
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A2E',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#8A8A8A',
        marginTop: 4,
        textAlign: 'center',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 120,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EFEFEF',
    },
    friendName: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    iconButton: {
        padding: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 4,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        paddingTop: 15,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    buyButton: {
        backgroundColor: Colors.primary,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
