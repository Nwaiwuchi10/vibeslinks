import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const REPORT_REASONS = [
    'Spam',
    'Harassment',
    'False Information',
    'Hate Speech',
    'Violence',
    'Nudity',
    'Scam/Fraud',
    'Copyright Issue',
    'Other',
];

export default function ReportScreen() {
    const [selectedReason, setSelectedReason] = useState<string>('Harassment');

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report</Text>
            </View>

            <Text style={styles.subtitle}>Why are you reporting this person?</Text>

            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {REPORT_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason;
                    return (
                        <TouchableOpacity 
                            key={reason} 
                            style={styles.reasonRow}
                            onPress={() => setSelectedReason(reason)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.reasonText, !isSelected && { color: '#8A8A8A', fontWeight: '500' }]}>{reason}</Text>
                            
                            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                {isSelected && <Ionicons name="checkmark" size={12} color="#FFF" />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginRight: 16,
        position: 'absolute',
        left: 20,
        zIndex: 10,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#8A8A8A',
        marginTop: 8,
        marginBottom: 24,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    reasonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        backgroundColor: '#8E2DE2',
        borderColor: '#8E2DE2',
    },
});
