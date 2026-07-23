import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { eventService } from '@/services/eventService';
import { store } from '@/store';
import { setLastPurchase } from '@/store/slices/eventSlice';

export default function TicketsMain() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await eventService.getMyTickets(activeTab);
      let list: any[] = [];
      if (res) {
        if (Array.isArray(res)) {
          list = res;
        } else if (res.sections && Array.isArray(res.sections[activeTab])) {
          list = res.sections[activeTab];
        } else if (Array.isArray(res[activeTab])) {
          list = res[activeTab];
        } else if (Array.isArray(res.items)) {
          list = res.items;
        } else if (res.data && Array.isArray(res.data)) {
          list = res.data;
        }
      }
      setTickets(list);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const renderTicketItem = ({ item }: { item: any }) => {
    const event = item.event || item;
    const title = event.title || item.title || 'Untitled Event';
    const category = event.category || item.category || 'EVENT';
    const location = event.location || item.location || 'Online / TBA';

    let imageUri = event.imageUrl || event.coverUrl || item.image;
    const imageSource = typeof imageUri === 'string' && imageUri.startsWith('http')
      ? { uri: imageUri }
      : imageUri;

    let priceText = item.price || item.totalAmount || event.price || '—';
    if (typeof priceText === 'number') {
      priceText = `₦${priceText.toLocaleString()}`;
    }

    return (
      <View style={styles.ticketCard}>
        <View style={styles.cardInfoContainer}>
          <Image source={imageSource} style={styles.eventImage} contentFit="cover" />
          <View style={styles.eventDetails}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
            </View>
            <Text style={styles.eventTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.locationText}>{location}</Text>
            </View>
            <Text style={styles.priceText}>
              <Text style={styles.priceValue}>{priceText}</Text> {item.price ? '' : '/Person'}
            </Text>
          </View>
        </View>

        <View style={styles.cardButtons}>
          {activeTab === 'upcoming' ? (
            <>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={async () => {
                  try {
                    const eventId = event.id || event._id;
                    const purchaseId = item.id || item._id;
                    if (eventId && purchaseId) {
                      await eventService.cancelTicketPurchase(eventId, purchaseId);
                      fetchTickets();
                    }
                  } catch (e) {
                    console.error('Failed to cancel ticket purchase:', e);
                  }
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.eTicketButton}
                onPress={() => {
                  store.dispatch(setLastPurchase({ ticket: item }));
                  router.push('/e-ticket');
                }}
              >
                <Text style={styles.eTicketButtonText}>E-Ticket</Text>
              </TouchableOpacity>
            </>
          ) : activeTab === 'completed' ? (
            <>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => router.push('/tickets/review')}
              >
                <Text style={styles.cancelButtonText}>Leave Review</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.eTicketButton}
                onPress={() => {
                  store.dispatch(setLastPurchase({ ticket: item }));
                  router.push('/e-ticket');
                }}
              >
                <Text style={styles.eTicketButtonText}>E-Ticket</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialCommunityIcons name="ticket-outline" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No tickets yet</Text>
        <Text style={styles.emptySubtitle}>Discover events and secure your spot instantly</Text>
        <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.exploreButtonText}>Explore Events</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Tickets</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id || item._id || String(Math.random())}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  eventImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  priceValue: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  cardButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  eTicketButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eTicketButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
