import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import OnboardingControls from './OnboardingControls';
import OnboardingSlide, { SlideData } from './OnboardingSlide';

const { width } = Dimensions.get('window');

const SLIDES: SlideData[] = [
  {
    id: 'music',
    title: 'Connect With',
    titleAccent: 'Music &\nEntertainment',
    titleSuffix: 'Communities',
    subtitle: 'Follow artists, join conversations, and share\nmoments with friends.',
    imageSource: require('@/assets/images/onboarding/slide1.png'),
  },
  {
    id: 'tickets',
    title: 'Buy Tickets',
    titleAccent: 'Instantly',
    titleAccentColor: Colors.textDark,
    subtitle: 'Secure your spot at trending events with fast\ncheckout and QR tickets.',
    imageSource: require('@/assets/images/onboarding/slide2.png'),
    isLast: true,
  },
];

interface OnboardingScreenProps {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (index < 0 || index >= SLIDES.length) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      onDone();
    }
  }, [currentIndex, scrollToIndex, onDone]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentIndex(newIndex);
    },
    []
  );

  const renderSlide = useCallback(
    ({ item }: { item: SlideData }) => <OnboardingSlide slide={item} />,
    []
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        bounces={false}
        decelerationRate="fast"
      />

      <OnboardingControls
        total={SLIDES.length}
        currentIndex={currentIndex}
        isLastSlide={isLastSlide}
        onSkip={onDone}
        onPrev={handlePrev}
        onNext={handleNext}
        onGetStarted={onDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slideBg,
  },
});
