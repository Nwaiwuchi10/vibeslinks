import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PkBattleOverlayProps {
  visible: boolean;
  host1Name?: string;
  host1Avatar?: string;
  host1Score?: number;
  host2Name?: string;
  host2Avatar?: string;
  host2Score?: number;
  remainingSeconds?: number;
  onSendBoost?: () => void;
  onEndBattle?: () => void;
  isHost?: boolean;
}

export const PkBattleOverlay: React.FC<PkBattleOverlayProps> = ({
  visible,
  host1Name = 'Host',
  host1Avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  host1Score = 1420,
  host2Name = 'Opponent',
  host2Avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  host2Score = 890,
  remainingSeconds = 175,
  onSendBoost,
  onEndBattle,
  isHost = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);

  useEffect(() => {
    setTimeLeft(remainingSeconds);
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  if (!visible) return null;

  const totalScore = host1Score + host2Score || 1;
  const host1Percent = Math.max(10, Math.min(90, (host1Score / totalScore) * 100));
  const host2Percent = 100 - host1Percent;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerLabel = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={styles.container}>
      {/* Top PK Status & Timer Bar */}
      <View style={styles.topStatusRow}>
        <View style={styles.host1Info}>
          <Image source={{ uri: host1Avatar }} style={styles.hostAvatar} />
          <Text style={styles.hostName} numberOfLines={1}>
            {host1Name}
          </Text>
        </View>

        {/* Timer badge */}
        <View style={styles.timerBadge}>
          <Text style={styles.pkTitle}>🔥 PK BATTLE</Text>
          <Text style={styles.timerText}>{timerLabel}</Text>
        </View>

        <View style={styles.host2Info}>
          <Text style={styles.hostName} numberOfLines={1}>
            {host2Name}
          </Text>
          <Image source={{ uri: host2Avatar }} style={styles.hostAvatar} />
        </View>
      </View>

      {/* Red vs Blue Progress Bar */}
      <View style={styles.progressBarWrapper}>
        <View style={[styles.redBar, { width: `${host1Percent}%` }]}>
          <Text style={styles.scoreTextLeft}>{host1Score}</Text>
        </View>
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={[styles.blueBar, { width: `${host2Percent}%` }]}>
          <Text style={styles.scoreTextRight}>{host2Score}</Text>
        </View>
      </View>

      {/* Quick Boost / Host End Action */}
      <View style={styles.bottomRow}>
        {onSendBoost && (
          <TouchableOpacity style={styles.boostBtn} onPress={onSendBoost} activeOpacity={0.8}>
            <Text style={styles.boostBtnText}>⚡ Send Gift Boost</Text>
          </TouchableOpacity>
        )}
        {isHost && onEndBattle && (
          <TouchableOpacity style={styles.endPkBtn} onPress={onEndBattle} activeOpacity={0.8}>
            <Text style={styles.endPkBtnText}>End PK</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
    left: 12,
    right: 12,
    zIndex: 900,
  },
  topStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  host1Info: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width * 0.3,
  },
  host2Info: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width * 0.3,
    justifyContent: 'flex-end',
  },
  hostAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  hostName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
    marginHorizontal: 6,
  },
  timerBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  pkTitle: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarWrapper: {
    height: 22,
    borderRadius: 11,
    flexDirection: 'row',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  redBar: {
    backgroundColor: '#FF2E93',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  blueBar: {
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  scoreTextLeft: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 11,
  },
  scoreTextRight: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 11,
  },
  vsBadge: {
    position: 'absolute',
    left: '50%',
    marginLeft: -14,
    top: 0,
    bottom: 0,
    width: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transform: [{ skewX: '-15deg' }],
  },
  vsText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    gap: 8,
  },
  boostBtn: {
    backgroundColor: 'rgba(255, 46, 147, 0.9)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  boostBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  endPkBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  endPkBtnText: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '700',
  },
});
