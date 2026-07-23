import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    FlatList,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setBookingInfo } from '@/store/slices/eventSlice';

export default function BookTicketScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const dispatch = useDispatch();
    const bookingInfo = useSelector((state: RootState) => state.event.bookingInfo);

    const [gender, setGender] = useState(bookingInfo?.buyer?.gender || 'Male');
    const [country, setCountry] = useState(bookingInfo?.buyer?.country || 'Nigeria');
    const [fullName, setFullName] = useState(bookingInfo?.buyer?.fullName || '');
    const [email, setEmail] = useState(bookingInfo?.buyer?.email || '');
    const [phone, setPhone] = useState(bookingInfo?.buyer?.phoneNumber || '');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');

    const handleContinue = () => {
        if (!fullName.trim() || !email.trim() || !phone.trim()) {
            return;
        }
        dispatch(setBookingInfo({
            ...bookingInfo,
            buyer: {
                fullName,
                email,
                phoneNumber: phone,
                gender,
                country,
            }
        }));
        router.push({ pathname: '/ticket-summary', params: { id } });
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Ticket</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Full Name */}
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Full Name"
                        placeholderTextColor="#BBBBBB"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                {/* Email */}
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#BBBBBB"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                {/* Gender */}
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                    {['Male', 'Female'].map(g => (
                        <TouchableOpacity 
                            key={g} 
                            style={[
                                styles.dropdownBox, 
                                { flex: 1, justifyContent: 'center', borderColor: gender === g ? '#8E2DE2' : '#EBEBEB', borderWidth: gender === g ? 2 : 1 }
                            ]}
                            onPress={() => setGender(g)}
                        >
                            <Text style={{ textAlign: 'center', color: gender === g ? '#8E2DE2' : '#333', fontWeight: gender === g ? '700' : '400' }}>{g}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Phone */}
                <Text style={styles.fieldLabel}>Phone</Text>
                <View style={styles.phoneRow}>
                    <View style={styles.countryCodeBox}>
                        <Text style={styles.countryCodeText}>NGN +234</Text>
                    </View>
                    <View style={styles.phoneInputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#BBBBBB"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                </View>

                {/* Country */}
                <Text style={styles.fieldLabel}>Country</Text>
                <TouchableOpacity 
                    style={styles.dropdownBox} 
                    onPress={() => {
                        setCountrySearchQuery('');
                        setShowCountryPicker(true);
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.dropdownText}>{country}</Text>
                    <Ionicons name="chevron-down" size={18} color="#888" />
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.ctaBtn, (!fullName.trim() || !email.trim() || !phone.trim()) && { opacity: 0.5 }]}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={!fullName.trim() || !email.trim() || !phone.trim()}
                >
                    <Text style={styles.ctaBtnText}>Continue</Text>
                </TouchableOpacity>
            </View>

            {/* Country Picker Modal */}
            <Modal
                visible={showCountryPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCountryPicker(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ width: '100%' }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.modalSheet}
                        >
                            <View style={styles.modalHandle} />
                            
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Country</Text>
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setShowCountryPicker(false)}
                                >
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.searchBarContainer}>
                                <Ionicons name="search" size={20} color="#8A8A8A" />
                                <TextInput
                                    style={styles.searchBarInput}
                                    placeholder="Search country..."
                                    placeholderTextColor="#8A8A8A"
                                    value={countrySearchQuery}
                                    onChangeText={setCountrySearchQuery}
                                    autoCorrect={false}
                                />
                                {countrySearchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setCountrySearchQuery('')}>
                                        <Ionicons name="close-circle" size={18} color="#8A8A8A" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <FlatList
                                data={COUNTRIES.filter(c => 
                                    c.toLowerCase().includes(countrySearchQuery.toLowerCase())
                                )}
                                keyExtractor={(item) => item}
                                style={{ maxHeight: 350 }}
                                renderItem={({ item }) => {
                                    const isSelected = country === item;
                                    return (
                                        <TouchableOpacity
                                            style={[styles.countryItem, isSelected && styles.countryItemSelected]}
                                            onPress={() => {
                                                setCountry(item);
                                                setShowCountryPicker(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.countryItemText,
                                                isSelected && styles.countryItemTextSelected
                                            ]}>
                                                {item}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={20} color="#8E2DE2" />
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
    inputBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    input: {
        fontSize: 15,
        color: '#333',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
        marginTop: 4,
    },
    dropdownBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: { fontSize: 15, color: '#333' },
    phoneRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    countryCodeBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    countryCodeText: { fontSize: 14, color: '#333' },
    phoneInputBox: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: '#F5F5F7',
    },
    ctaBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    ctaBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#DDD',
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    closeButton: {
        padding: 4,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        marginHorizontal: 20,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        marginBottom: 16,
    },
    searchBarInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginLeft: 8,
        padding: 0,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F7',
    },
    countryItemSelected: {
        backgroundColor: '#F8F3FF',
    },
    countryItemText: {
        fontSize: 15,
        color: '#333',
    },
    countryItemTextSelected: {
        color: '#8E2DE2',
        fontWeight: '600',
    },
});
