import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { liveStreamService } from '@/services/liveStreamService';

export default function FloatingStreamBanner() {
    const [visible, setVisible] = useState(false);
    const [activeStream, setActiveStream] = useState<any>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    useFocusEffect(
        useCallback(() => {
            let activeTimer: any;
            
            // Fetch live streams from backend
            liveStreamService.getActiveStreams()
                .then((res) => {
                    const list = Array.isArray(res) ? res : res?.items || [];
                    if (list.length > 0) {
                        const stream = list[0]; // grab the most relevant active live stream
                        setActiveStream(stream);
                        
                        // Show banner after 3 seconds
                        activeTimer = setTimeout(() => {
                            setVisible(true);
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 500,
                                useNativeDriver: true,
                            }).start();
                        }, 3000);
                    }
                })
                .catch(() => {});

            return () => {
                clearTimeout(activeTimer);
                setVisible(false);
                fadeAnim.setValue(0);
            };
        }, [fadeAnim])
    );

    if (!visible || !activeStream) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <TouchableOpacity 
                style={styles.bannerContent}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/live-details', params: { id: activeStream.id } })}
            >
                <View style={styles.leftContent}>
                    <MaterialCommunityIcons name="waveform" size={20} color="#FFF" />
                    <Text style={styles.title} numberOfLines={1}>{activeStream.title || 'Live Stream'}</Text>
                    <Ionicons name="chevron-forward-circle" size={16} color="#FFF" style={styles.arrowIcon} />
                </View>
                <View style={styles.streamBtn}>
                    <Text style={styles.streamBtnText}>STREAM</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20, // Sit just above the bottom tab bar
        left: 20,
        right: 20,
        backgroundColor: '#8E2DE2',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#8E2DE2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 999,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
    },
    arrowIcon: {
        marginLeft: 8,
    },
    streamBtn: {
        backgroundColor: '#F3E5FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    streamBtnText: {
        color: '#8E2DE2',
        fontSize: 13,
        fontWeight: '700',
    },
});
