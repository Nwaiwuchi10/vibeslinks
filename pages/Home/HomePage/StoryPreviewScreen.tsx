import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function StoryPreviewScreen() {
    const params = useLocalSearchParams<{ image: string }>();
    const imageUri = params.image || 'https://images.unsplash.com/photo-1605022600390-071c6ef3518a?w=600';

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.backgroundImage} resizeMode="cover" />
            
            <View style={styles.safeTop}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150' }} style={styles.avatar} />
                        <Text style={styles.username}>Wazobia <Ionicons name="checkmark-circle" size={12} color="#FFF" /> .2h</Text>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                        <Ionicons name="close" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.safeBottom}>
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.toFriendsBtn} onPress={() => router.push('/')}>
                        <Text style={styles.toFriendsText}>To Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn} onPress={() => router.push('/')}>
                        <Text style={styles.shareText}>Shear</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width,
        height,
        position: 'absolute',
    },
    safeTop: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    username: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeBottom: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toFriendsBtn: {
        backgroundColor: '#444',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    toFriendsText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    shareBtn: {
        backgroundColor: '#8E2DE2',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    shareText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
