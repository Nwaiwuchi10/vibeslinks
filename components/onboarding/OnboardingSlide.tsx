import React from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export interface SlideData {
  id: string;
  title: string;
  titleAccent: string;
  titleAccentColor?: string;
  titleSuffix?: string;
  subtitle: string;
  imageSource: ImageSourcePropType;
  isLast?: boolean;
}

interface OnboardingSlideProps {
  slide: SlideData;
}

export default function OnboardingSlide({ slide }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      {/* Top image area — ~58% of screen */}
      <View style={styles.imageContainer}>
        <Image
          source={slide.imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Bottom text card */}
      <View style={styles.textCard}>
        <Text style={styles.title}>
          {slide.title}{' '}
          <Text style={[styles.titleAccent, { color: slide.titleAccentColor ?? Colors.primary }]}>
            {slide.titleAccent}
          </Text>
          {slide.titleSuffix ? ` ${slide.titleSuffix}` : ''}
        </Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: Colors.slideBg,
  },
  imageContainer: {
    width,
    height: height * 0.58,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 28,
    marginTop: -20,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.select({ ios: 26, android: 24 }),
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: Platform.select({ ios: 36, android: 34 }),
    marginBottom: 12,
  },
  titleAccent: {
    fontWeight: '800',
  },
  subtitle: {
    fontSize: Platform.select({ ios: 15, android: 14 }),
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
