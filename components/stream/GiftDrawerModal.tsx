import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coinAmount: number;
  category: 'popular' | 'classic' | 'premium' | 'luxury' | 'epic';
  animationType: string;
}

export const TIKTOK_GIFTS_LIST: VirtualGift[] = [
  { id: 'rose', name: 'Rose', icon: '🌹', coinAmount: 1, category: 'popular', animationType: 'float' },
  { id: 'heart', name: 'Finger Heart', icon: '🫰', coinAmount: 5, category: 'popular', animationType: 'float' },
  { id: 'coffee', name: 'Coffee', icon: '☕', coinAmount: 10, category: 'popular', animationType: 'bounce' },
  { id: 'perfume', name: 'Perfume', icon: '🧴', coinAmount: 20, category: 'classic', animationType: 'sparkle' },
  { id: 'crown', name: 'Diamond Crown', icon: '👑', coinAmount: 99, category: 'premium', animationType: 'crown_fullscreen' },
  { id: 'sports_car', name: 'Sports Car', icon: '🏎️', coinAmount: 299, category: 'luxury', animationType: 'car_fullscreen' },
  { id: 'rocket', name: 'Space Rocket', icon: '🚀', coinAmount: 599, category: 'luxury', animationType: 'rocket_fullscreen' },
  { id: 'lion', name: 'Golden Lion', icon: '🦁', coinAmount: 999, category: 'epic', animationType: 'lion_fullscreen' },
  { id: 'dragon', name: 'Fire Dragon', icon: '🐉', coinAmount: 1999, category: 'epic', animationType: 'dragon_fullscreen' },
];

const CATEGORIES = ['All', 'Popular', 'Classic', 'Luxury', 'Epic'];
const COMBO_MULTIPLIERS = [1, 5, 10, 99];

interface GiftDrawerModalProps {
  visible: boolean;
  onClose: () => void;
  onSendGift: (gift: VirtualGift, count: number) => void;
  userCoins?: number;
}

export const GiftDrawerModal: React.FC<GiftDrawerModalProps> = ({
  visible,
  onClose,
  onSendGift,
  userCoins = 1450,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(TIKTOK_GIFTS_LIST[0]);
  const [multiplier, setMultiplier] = useState(1);
  const [showMultiplierDropdown, setShowMultiplierDropdown] = useState(false);

  const filteredGifts =
    selectedCategory === 'All'
      ? TIKTOK_GIFTS_LIST
      : TIKTOK_GIFTS_LIST.filter(
          (g) => g.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleSend = () => {
    if (!selectedGift) return;
    onSendGift(selectedGift, multiplier);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Header Bar */}
              <View style={styles.headerBar}>
                {/* Coin Balance */}
                <View style={styles.coinBalanceContainer}>
                  <Text style={styles.coinIcon}>🪙</Text>
                  <Text style={styles.coinAmountText}>{userCoins}</Text>
                  <TouchableOpacity style={styles.rechargeBtn}>
                    <Text style={styles.rechargeBtnText}>Recharge</Text>
                    <Ionicons name="chevron-forward" size={12} color="#FFF" />
                  </TouchableOpacity>
                </View>

                {/* Close Button */}
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Categories Tabs */}
              <View style={styles.categoriesRow}>
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryTabText,
                          isActive && styles.categoryTabTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Gifts Grid */}
              <FlatList
                data={filteredGifts}
                keyExtractor={(item) => item.id}
                numColumns={4}
                contentContainerStyle={styles.giftsGridContent}
                renderItem={({ item }) => {
                  const isSelected = selectedGift.id === item.id;
                  return (
                    <TouchableOpacity
                      style={[styles.giftItemCard, isSelected && styles.giftItemCardSelected]}
                      activeOpacity={0.7}
                      onPress={() => setSelectedGift(item)}
                    >
                      <Text style={styles.giftIcon}>{item.icon}</Text>
                      <Text style={styles.giftName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.giftPriceRow}>
                        <Text style={styles.giftCoinSmall}>🪙</Text>
                        <Text style={styles.giftPriceText}>{item.coinAmount}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* Bottom Action Row */}
              <View style={styles.bottomActionRow}>
                {/* Combo Selector */}
                <View style={styles.multiplierContainer}>
                  {COMBO_MULTIPLIERS.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.multiplierPill,
                        multiplier === m && styles.multiplierPillActive,
                      ]}
                      onPress={() => setMultiplier(m)}
                    >
                      <Text
                        style={[
                          styles.multiplierText,
                          multiplier === m && styles.multiplierTextActive,
                        ]}
                      >
                        {m}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Send Button */}
                <TouchableOpacity
                  style={styles.sendButton}
                  activeOpacity={0.8}
                  onPress={handleSend}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                  <Ionicons name="sparkles" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#181A20',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coinBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  coinAmountText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 8,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E2DE2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rechargeBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2,
  },
  closeBtn: {
    padding: 6,
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryTabText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  giftsGridContent: {
    paddingBottom: 10,
  },
  giftItemCard: {
    width: (width - 32) / 4 - 8,
    margin: 4,
    height: 96,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    padding: 4,
  },
  giftItemCardSelected: {
    borderColor: '#FF2E93',
    backgroundColor: 'rgba(255, 46, 147, 0.15)',
  },
  giftIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  giftName: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  giftPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  giftCoinSmall: {
    fontSize: 10,
    marginRight: 2,
  },
  giftPriceText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  multiplierPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  multiplierPillActive: {
    backgroundColor: 'rgba(255, 46, 147, 0.25)',
    borderWidth: 1,
    borderColor: '#FF2E93',
  },
  multiplierText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  multiplierTextActive: {
    color: '#FF2E93',
    fontWeight: '700',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF2E93',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
