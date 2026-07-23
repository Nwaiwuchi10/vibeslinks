import React from 'react';
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

interface StripeWebViewModalProps {
    visible: boolean;
    publishableKey: string;
    clientSecret: string;
    amountText: string;
    onClose: () => void;
    onSuccess: (paymentIntentId: string) => void;
    onError: (errorMessage: string) => void;
}

export default function StripeWebViewModal({
    visible,
    publishableKey,
    clientSecret,
    amountText,
    onClose,
    onSuccess,
    onError,
}: StripeWebViewModalProps) {
    if (!visible || !publishableKey || !clientSecret) return null;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #F8F9FA; color: #1A1A2E; padding: 20px 16px; min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-start; }
    .header-box { text-align: center; margin-bottom: 20px; padding-top: 10px; }
    .title { font-size: 18px; font-weight: 700; color: #1A1A2E; margin-bottom: 6px; }
    .amount { font-size: 28px; font-weight: 800; color: #7B2FFF; letter-spacing: -0.5px; }
    .card-box { background: #FFFFFF; border-radius: 20px; padding: 20px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EFEFEF; }
    #payment-element { margin-bottom: 20px; min-height: 200px; }
    #submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #9B5FFF, #7B2FFF);
      color: #FFFFFF;
      border: none;
      padding: 16px;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(123, 47, 255, 0.35);
      transition: all 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    #error-message { color: #E91E63; font-size: 13px; margin-top: 12px; text-align: center; display: none; font-weight: 500; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="title">Pay for Ticket</div>
    <div class="amount">${amountText}</div>
  </div>

  <div class="card-box">
    <form id="payment-form">
      <div id="payment-element"></div>
      <button id="submit-btn">
        <span id="btn-text">Pay Now</span>
        <span id="spinner" class="spinner" style="display:none;"></span>
      </button>
      <div id="error-message"></div>
    </form>
  </div>

  <script>
    const stripe = Stripe('${publishableKey}');
    const clientSecret = '${clientSecret}';

    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#7B2FFF',
        colorBackground: '#FFFFFF',
        colorText: '#1A1A2E',
        borderRadius: '10px'
      }
    };

    const elements = stripe.elements({ clientSecret, appearance });
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');

    const form = document.getElementById('payment-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('spinner');
    const errorMsg = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      spinner.style.display = 'inline-block';
      errorMsg.style.display = 'none';

      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: 'https://vibezlink.app/stripe-return',
          },
          redirect: 'if_required'
        });

        if (error) {
          errorMsg.textContent = error.message || 'Payment failed. Please try again.';
          errorMsg.style.display = 'block';
          submitBtn.disabled = false;
          btnText.style.display = 'inline-block';
          spinner.style.display = 'none';
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              event: 'failed',
              error: error.message
            }));
          }
        } else if (paymentIntent) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              event: 'succeeded',
              paymentIntentId: paymentIntent.id
            }));
          }
        }
      } catch (err) {
        errorMsg.textContent = err.message || 'An unexpected error occurred.';
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
      }
    });
  </script>
</body>
</html>
    `;

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.event === 'succeeded' && data.paymentIntentId) {
                onSuccess(data.paymentIntentId);
            } else if (data.event === 'failed') {
                onError(data.error || 'Payment failed');
            }
        } catch {
            // Ignore non-JSON messages
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="close" size={22} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Stripe Payment</Text>
                    <View style={{ width: 40 }} />
                </View>

                <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlContent, baseUrl: 'https://js.stripe.com' }}
                    onMessage={handleMessage}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    renderLoading={() => (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.loadingText}>Loading Stripe Checkout...</Text>
                        </View>
                    )}
                    style={{ flex: 1 }}
                />
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
        color: Colors.textGray,
        fontWeight: '500',
    },
});
