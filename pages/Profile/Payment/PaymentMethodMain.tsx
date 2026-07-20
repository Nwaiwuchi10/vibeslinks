import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { userService } from '@/services/userService';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

export default function PaymentMethodMain() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchPaymentMethods = async () => {
    try {
      const response = await userService.getPaymentMethods();
      const list = response?.cards || response || [];
      setCards(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('[PaymentMethodMain] Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleSetDefault = async (id: string) => {
    setSubmittingAction(true);
    try {
      await userService.setDefaultPaymentMethod(id);
      await fetchPaymentMethods();
    } catch (err) {
      console.error('[PaymentMethodMain] Set default failed:', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setSubmittingAction(true);
            try {
              await userService.deletePaymentMethod(id);
              await fetchPaymentMethods();
            } catch (err) {
              console.error('[PaymentMethodMain] Delete card failed:', err);
            } finally {
              setSubmittingAction(false);
            }
          },
        },
      ]
    );
  };

  const getBrandIcon = (brand: string) => {
    const b = brand?.toLowerCase();
    if (b === 'visa') return 'credit-card-outline';
    if (b === 'mastercard') return 'credit-card-outline';
    return 'credit-card-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/profile/add-card')}
          >
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginVertical: 30 }} />
        ) : cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="credit-card-off-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No saved cards found</Text>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View 
                key={card.id} 
                style={[
                  styles.cardItem, 
                  card.isDefault && styles.activeCardItem
                ]}
              >
                <View style={styles.cardMain}>
                  <MaterialCommunityIcons 
                    name={getBrandIcon(card.cardBrand) as any} 
                    size={26} 
                    color={card.isDefault ? Colors.primary : '#666'} 
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrand}>{card.cardBrand?.toUpperCase() || 'Card'}</Text>
                    <Text style={styles.cardNumber}>•••• •••• •••• {card.cardLast4}</Text>
                    <Text style={styles.cardExpiry}>Expires {card.expMonth}/{card.expYear}</Text>
                    {card.cardholderName && (
                      <Text style={styles.cardHolder}>{card.cardholderName}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.cardActions}>
                  {!card.isDefault ? (
                    <TouchableOpacity 
                      style={styles.actionBtn}
                      onPress={() => handleSetDefault(card.id)}
                      disabled={submittingAction}
                    >
                      <Text style={styles.actionBtnText}>Set Default</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#FFF" />
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteCard(card.id)}
                    disabled={submittingAction}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
    marginTop: 12,
    fontWeight: '500',
  },
  cardsList: {
    gap: 16,
  },
  cardItem: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  activeCardItem: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  cardMain: {
    flexDirection: 'row',
    gap: 16,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardBrand: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardExpiry: {
    fontSize: 12,
    color: '#666',
  },
  cardHolder: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  actionBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  defaultBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FFF1F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
