import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withDelay,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Pulse = ({ delay = 0 }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(3, { duration: 2500 }), -1, false)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: 2500 }), -1, false)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulse, animatedStyle]} />;
};

const SearchingRadio = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 4000); // Simulate search for 4 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map Background Placeholder */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop' }} 
        style={styles.map}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.center}>
        <Pulse delay={0} />
        <Pulse delay={800} />
        <Pulse delay={1600} />
        
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="navigation-variant" size={40} color="#8E2DE2" />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.searchingText}>Searching for Radio Stations...</Text>
      </View>
    </View>
  );
};

export default SearchingRadio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    width: width,
    height: height,
    opacity: 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,10,30,0.6)',
  },
  center: {
    position: 'absolute',
    top: height / 2 - 50,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(142, 45, 226, 0.4)',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#8E2DE2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  searchingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
