import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { stripeService } from '@/services/stripeService';

interface StripeCheckoutModalProps {
    visible: boolean;
    checkoutUrl: string | null;
    onClose: () => void;
    onSuccess: (purchaseData: any) => void;
    onError: (errorMessage: string) => void;
}

export default function StripeCheckoutModal({
    visible,
    checkoutUrl,
    onClose,
    onSuccess,
    onError,
}: StripeCheckoutModalProps) {
    const [isVerifying, setIsVerifying] = useState(false);

    if (!visible || !checkoutUrl) return null;

    const handleNavigationStateChange = async (navState: any) => {
        const url = navState.url;
        console.log('[StripeCheckout] Navigation State Change:', url);

        // Check if redirecting to checkout/complete
        if (url.includes('/payments/checkout/complete') && !isVerifying) {
            setIsVerifying(true);
            try {
                // Extract session_id query parameter
                const urlObj = new URL(url);
                const sessionId = urlObj.searchParams.get('session_id');

                if (sessionId) {
                    console.log('[StripeCheckout] Extracted session_id:', sessionId);
                    const response = await stripeService.confirmCheckoutSession(sessionId);
                    console.log('[StripeCheckout] Session verified successfully:', response);
                    onSuccess(response);
                } else {
                    // Fail-safe: extract via regex if URL fails to parse normally
                    const match = url.match(/[?&]session_id=([^&#]+)/);
                    if (match && match[1]) {
                        console.log('[StripeCheckout] Extracted session_id (regex):', match[1]);
                        const response = await stripeService.confirmCheckoutSession(match[1]);
                        console.log('[StripeCheckout] Session verified successfully (regex):', response);
                        onSuccess(response);
                    } else {
                        onError('Unable to verify payment session ID.');
                    }
                }
            } catch (err: any) {
                console.error('[StripeCheckout] Verification failed:', err);
                onError(err?.response?.data?.message || err?.message || 'Payment verification failed.');
            } finally {
                setIsVerifying(false);
            }
        } else if (url.includes('/payments/checkout/cancelled')) {
            onError('Payment was cancelled.');
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isVerifying}>
                        <Ionicons name="close" size={22} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Secure Payment</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* WebView / Verification Spinner */}
                {isVerifying ? (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#8E2DE2" />
                        <Text style={styles.loadingText}>Verifying ticket purchase...</Text>
                    </View>
                ) : (
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: checkoutUrl }}
                        onNavigationStateChange={handleNavigationStateChange}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                        renderLoading={() => (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#8E2DE2" />
                                <Text style={styles.loadingText}>Loading Stripe Checkout...</Text>
                            </View>
                        )}
                        style={{ flex: 1 }}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#8A8A8A',
        fontWeight: '500',
    },
});
