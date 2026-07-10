import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideToast, ToastItem } from '@/store/slices/toastSlice';

const { width } = Dimensions.get('window');

function SingleToast({ toast }: { toast: ToastItem }) {
  const dispatch = useAppDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Slide in and Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Setup auto-dismiss timer
    const timer = setTimeout(() => {
      dismiss();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(hideToast(toast.id));
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: '#E8F5E9',
          border: '#A5D6A7',
          icon: 'checkmark-circle',
          iconColor: '#2E7D32',
        };
      case 'error':
        return {
          bg: '#FFEBEE',
          border: '#EF9A9A',
          icon: 'alert-circle',
          iconColor: '#C62828',
        };
      case 'warning':
        return {
          bg: '#FFF8E1',
          border: '#FFE082',
          icon: 'warning',
          iconColor: '#F57F17',
        };
      case 'info':
      default:
        return {
          bg: '#E3F2FD',
          border: '#90CAF9',
          icon: 'information-circle',
          iconColor: '#1565C0',
        };
    }
  };

  const styleConfig = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: styleConfig.bg,
          borderColor: styleConfig.border,
        },
      ]}
    >
      <Ionicons name={styleConfig.icon as any} size={22} color={styleConfig.iconColor} style={styles.icon} />
      <Text style={[styles.toastText, { color: styleConfig.iconColor }]}>{toast.message}</Text>
      <TouchableOpacity onPress={dismiss} style={styles.closeButton}>
        <Ionicons name="close" size={18} color={styleConfig.iconColor} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.toast.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + (Platform.OS === 'ios' ? 8 : 16) }]}>
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  toastWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 40,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  closeButton: {
    padding: 2,
    marginLeft: 10,
  },
});
