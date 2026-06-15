import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const menuItems = [
  {
    id: 'your-profile',
    title: 'Your Profile',
    icon: 'person-outline',
    route: '/profile/edit',
    iconType: 'Ionicons',
  },
  {
    id: 'payment-method',
    title: 'Payment Method',
    icon: 'credit-card-outline',
    route: '/profile/payment',
    iconType: 'MaterialCommunityIcons',
  },
  {
    id: 'following',
    title: 'Following',
    icon: 'account-plus-outline',
    route: '/profile/following',
    iconType: 'MaterialCommunityIcons',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings-outline',
    route: '/profile/settings',
    iconType: 'Ionicons',
  },
  {
    id: 'help-center',
    title: 'Help Center',
    icon: 'information-circle-outline',
    route: '/profile/help-center',
    iconType: 'Ionicons',
  },
  {
    id: 'privacy-policy',
    title: 'Private Policy',
    icon: 'shield-outline',
    route: '/profile/privacy-policy',
    iconType: 'Ionicons',
  },
  {
    id: 'invite-friends',
    title: 'Invite Friends',
    icon: 'account-multiple-plus-outline',
    route: '/profile/invite-friends',
    iconType: 'MaterialCommunityIcons',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const renderIcon = (item: any) => {
    if (item.iconType === 'Ionicons') {
      return <Ionicons name={item.icon} size={22} color={Colors.primary} />;
    } else if (item.iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={item.icon} size={22} color={Colors.primary} />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.dashboardButton}>
          <MaterialCommunityIcons name="wallet-outline" size={18} color="#FFF" />
          <Text style={styles.dashboardText}>Your Dashboard</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/artist_event.png')} // Fallback if my generated image isn't moved yet
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="person-outline" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Roland Emmanuel</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  {renderIcon(item)}
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          ))}
          
          {/* Logout Item */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => setLogoutModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF5F5' }]}>
                <Ionicons name="log-out-outline" size={22} color="#FF4D4D" />
              </View>
              <Text style={[styles.menuItemText, { color: '#FF4D4D' }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons name="logout-variant" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => {
                  setLogoutModalVisible(false);
                }}
              >
                <Text style={styles.logoutButtonText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
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
    marginLeft: -20, // Adjust for center alignment with dashboard button
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  dashboardText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f5ff', // Very light purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  logoutButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
