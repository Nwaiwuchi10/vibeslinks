import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AdsBanner = () => {
    return (
        <View style={styles.adBannerContainer}>
            <ImageBackground
                source={require('../../../assets/images/djv.png')}
                style={styles.adBannerImage}
                imageStyle={{ borderRadius: 16 }}
            >
                <View style={styles.adDarkOverlay}>
                    <View style={styles.adTopRow}>
                        <View style={styles.badgeWhite}><Text style={styles.badgeWhiteText}>NIGHTLIFE</Text></View>
                        <View style={styles.badgeDark}><Text style={styles.badgeDarkText}>Ad</Text></View>
                    </View>
                    <View style={styles.adBottomRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.adTitle}>Worship Da King</Text>
                            <MaterialIcons name="verified" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                        </View>
                        <Text style={styles.adPrice}>₦5,000</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default AdsBanner;

const styles = StyleSheet.create({
    adBannerContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    adBannerImage: {
        width: '100%',
        height: 120,
    },
    adDarkOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
    },
    adTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    badgeWhite: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeWhiteText: { fontSize: 10, fontWeight: '700', color: '#000' },
    badgeDark: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeDarkText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
    adBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    adTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    adPrice: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
