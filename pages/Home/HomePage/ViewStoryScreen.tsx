import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ViewStoryScreen() {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1615112196695-171542f53d4c?w=600' }} 
                style={[styles.backgroundImage, showOptions && styles.blurredImage]} 
                resizeMode="cover" 
                blurRadius={showOptions ? 15 : 0}
            />
            
            <View style={styles.safeTop}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150' }} style={styles.avatar} />
                        <Text style={styles.username}>Wazobia <Ionicons name="checkmark-circle" size={12} color="#FFF" /> .2h</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowOptions(true)}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                            <Ionicons name="close" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.safeBottom}>
                <View style={styles.bottomBar}>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Send Message..."
                            placeholderTextColor="#E0E0E0"
                        />
                    </View>
                    <TouchableOpacity style={styles.actionIcon}>
                        <Ionicons name="heart-outline" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                        <Ionicons name="paper-plane-outline" size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Options Modal */}
            <Modal visible={showOptions} transparent animationType="slide" onRequestClose={() => setShowOptions(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowOptions(false)} />
                    <View style={styles.modalContent}>
                        <View style={styles.dragIndicator} />
                        
                        <TouchableOpacity style={styles.modalBtn} onPress={() => setShowOptions(false)}>
                            <Text style={styles.modalBtnText}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => setShowOptions(false)}>
                            <Text style={[styles.modalBtnText, { color: '#E91E63' }]}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    blurredImage: {
        opacity: 0.8,
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
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeBottom: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginRight: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    input: {
        color: '#FFF',
        fontSize: 15,
    },
    actionIcon: {
        marginLeft: 12,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#D1D1D1', // Matching the grey look from screenshot
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 12,
    },
    dragIndicator: {
        width: 48,
        height: 4,
        backgroundColor: '#888',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    modalBtn: {
        backgroundColor: '#EAEAEA',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 12,
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
