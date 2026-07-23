import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { homeService } from '@/services/homeService';
import { resolveImageUrl } from '@/services/apiClient';

const AdsBanner = ({ refreshKey }: { refreshKey?: number }) => {
  const [advert, setAdvert] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService.getAdverts()
      .then((items) => {
        if (items && items.length > 0) {
          setAdvert(items[0]);
        } else {
          setAdvert(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey]);

  if (loading || !advert) {
    return null;
  }

  const title = advert.title || 'Spotlight';
  const category = advert.category || 'PROMOTION';
  const price = advert.price ? `₦${Number(advert.price).toLocaleString()}` : '';
  const image = resolveImageUrl(advert.image || advert.imageUrl || advert.coverUrl || null);

  return (
    <TouchableOpacity
      style={styles.adBannerContainer}
      activeOpacity={0.9}
      onPress={() => {
        const targetId = advert.eventId || advert.id;
        if (targetId) {
          router.push({ pathname: '/event-details', params: { id: targetId } });
        }
      }}
    >
      <ImageBackground
        source={image ? { uri: image } : require('../../../assets/images/djv.png')}
        style={styles.adBannerImage}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.adDarkOverlay}>
          <View style={styles.adTopRow}>
            <View style={styles.badgeWhite}>
              <Text style={styles.badgeWhiteText}>{category.toUpperCase()}</Text>
            </View>
            <View style={styles.badgeDark}><Text style={styles.badgeDarkText}>Ad</Text></View>
          </View>
          <View style={styles.adBottomRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.adTitle}>{title}</Text>
              <MaterialIcons name="verified" size={14} color="#FFF" style={{ marginLeft: 4 }} />
            </View>
            {price ? <Text style={styles.adPrice}>{price}</Text> : null}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
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
