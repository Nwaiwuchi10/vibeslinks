import { Colors } from '../../../constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SuggestedHosts from './SuggestedHosts';

const SocialFeed = () => {
    return (
        <View>
            {/* Social Feed - Post 1 */}
            <View style={styles.feedPostCard}>
                <View style={styles.feedTopBadgeRow}>
                    <Text style={styles.feedBadgeText}>See where your friends are vibing</Text>
                    <TouchableOpacity style={styles.vibingBadge} onPress={() => router.push('/friends-vibing')}>
                        <View style={styles.vibingStack}>
                            {[5, 8, 11].map((img, i) => (
                                <Image key={i} source={{ uri: `https://i.pravatar.cc/150?img=${img}` }} style={[styles.vibingAvatar, { right: i * 10 }]} />
                            ))}
                        </View>
                        <Ionicons name="chevron-forward" size={12} color="#FFF" style={{ marginLeft: 20 }} />
                    </TouchableOpacity>
                </View>

                <Image source={require('../../../assets/images/dav.png')} style={styles.feedMainImage} />
                <Text style={styles.feedTitle}>Afro Summer Festival</Text>
                <View style={styles.nearYouInfoRow}>
                    <View style={styles.nearYouInfoItem}>
                        <Ionicons name="location" size={14} color={Colors.primary} />
                        <Text style={styles.nearYouInfoText}>Lekki Ikola, Lagos Nigeria</Text>
                    </View>
                    <View style={styles.nearYouInfoItem}>
                        <Ionicons name="calendar" size={14} color={Colors.primary} />
                        <Text style={styles.nearYouInfoText}>May 15 - 9:00 PM</Text>
                    </View>
                </View>
                <View style={[styles.nearYouFooter, { marginTop: 10 }]}>
                    <Text style={styles.priceHighlight}>₦10,000 <Text style={styles.priceSub}>/ Person</Text></Text>
                    <TouchableOpacity style={styles.viewEventButton}>
                        <Text style={styles.viewEventText}>View Event</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Social Feed - Post 2 */}
            <View style={styles.socialCard}>
                <View style={styles.socialHeader}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.socialAvatar} />
                    <Text style={styles.socialName}>am_official_percy <MaterialIcons name="verified" size={12} color={Colors.primary} /> <Text style={styles.socialTime}>. 2h</Text></Text>
                    <TouchableOpacity style={{ marginLeft: 'auto' }}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.socialCaption}>It's Friday. Let party together</Text>
                <Image source={require('../../../assets/images/event.png')} style={styles.socialImage} />

                <View style={styles.socialActions}>
                    <View style={styles.actionItem}>
                        <Ionicons name="heart-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>441</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <MaterialCommunityIcons name="comment-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>108</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="repeat" size={18} color="#888" />
                        <Text style={styles.actionText}>83</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="share" size={18} color="#888" />
                        <Text style={styles.actionText}>579</Text>
                    </View>
                </View>
            </View>

            {/* Social Feed - Post 3 (Video layout) */}
            <View style={styles.socialCard}>
                <View style={styles.socialHeader}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.socialAvatar} />
                    <Text style={styles.socialName}>am_official_percy <MaterialIcons name="verified" size={12} color={Colors.primary} /> <Text style={styles.socialTime}>. 2h</Text></Text>
                    <TouchableOpacity style={{ marginLeft: 'auto' }}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.socialCaption}>It's Friday. Let party together</Text>
                <View style={{ position: 'relative' }}>
                    <Image source={require('../../../assets/images/Rectangle 135.png')} style={styles.socialImage} />
                    <View style={styles.videoPlayOverlay}>
                        <View style={styles.playButtonWrapper}>
                            <Ionicons name="play" size={24} color={Colors.primary} style={{ marginLeft: 3 }} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.volumeIcon}>
                        <Ionicons name="volume-mute" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.socialActions}>
                    <View style={styles.actionItem}>
                        <Ionicons name="heart" size={18} color="#ED4956" />
                        <Text style={styles.actionText}>441</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <MaterialCommunityIcons name="comment-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>108</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="repeat" size={18} color="#888" />
                        <Text style={styles.actionText}>83</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="share" size={18} color="#888" />
                        <Text style={styles.actionText}>579</Text>
                    </View>
                </View>
            </View>
            {/* Suggested Hosts */}
            <View>
                <SuggestedHosts />
            </View>
            {/* Social Feed - Post 4 */}
            <View style={styles.socialCard}>
                <View style={styles.socialHeader}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.socialAvatar} />
                    <Text style={styles.socialName}>am_official_percy <MaterialIcons name="verified" size={12} color={Colors.primary} /> <Text style={styles.socialTime}>. 2h</Text></Text>
                    <TouchableOpacity style={{ marginLeft: 'auto' }}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.socialCaption}>It's Friday. Let party together</Text>
                <Image source={require('../../../assets/images/ye.png')} style={styles.socialImage} />
            </View>
        </View>
    );
};

export default SocialFeed;

const styles = StyleSheet.create({
    feedPostCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
        marginBottom: 16,
    },
    feedTopBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    feedBadgeText: { fontSize: 12, color: '#8A8A8A' },
    vibingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    vibingStack: { flexDirection: 'row', position: 'relative', height: 18, width: 45 },
    vibingAvatar: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: Colors.primary, position: 'absolute' },
    feedMainImage: {
        width: '100%',
        height: 300,
        borderRadius: 16,
        marginBottom: 12,
    },
    feedTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
    nearYouInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    nearYouInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    nearYouInfoText: {
        fontSize: 12,
        color: '#6B6B80',
        marginLeft: 4,
    },
    nearYouFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceHighlight: { fontSize: 16, color: Colors.primary, fontWeight: '800' },
    priceSub: { fontSize: 12, color: '#8A8A8A', fontWeight: '500' },
    viewEventButton: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    viewEventText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    socialCard: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
        paddingVertical: 16,
        marginBottom: 16,
    },
    socialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    socialAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
    socialName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
    socialTime: { fontSize: 13, fontWeight: '400', color: '#888' },
    socialCaption: { fontSize: 14, color: '#1A1A2E', paddingHorizontal: 20, marginBottom: 12 },
    socialImage: { width: '100%', height: 300 },
    socialActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        justifyContent: 'flex-start',
    },
    actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    actionText: { fontSize: 13, color: '#888', marginLeft: 6 },
    videoPlayOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    volumeIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
