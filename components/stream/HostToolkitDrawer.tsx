import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface HostToolkitDrawerProps {
  visible: boolean;
  onClose: () => void;
  onFlipCamera: () => void;
  onToggleTorch?: () => void;
  torchActive?: boolean;
  onToggleMic: () => void;
  isMuted?: boolean;
  onToggleMirror?: () => void;
  isMirrored?: boolean;
  onStartPkBattle: () => void;
  onOpenGuestManagement: () => void;
  onOpenSettings?: () => void;
}

export const HostToolkitDrawer: React.FC<HostToolkitDrawerProps> = ({
  visible,
  onClose,
  onFlipCamera,
  onToggleTorch,
  torchActive = false,
  onToggleMic,
  isMuted = false,
  onToggleMirror,
  isMirrored = false,
  onStartPkBattle,
  onOpenGuestManagement,
  onOpenSettings,
}) => {
  const tools = [
    {
      id: 'flip',
      label: 'Flip',
      icon: 'camera-reverse-outline',
      iconFamily: 'Ionicons',
      action: onFlipCamera,
      active: false,
    },
    {
      id: 'mic',
      label: isMuted ? 'Unmute' : 'Mute',
      icon: isMuted ? 'mic-off-outline' : 'mic-outline',
      iconFamily: 'Ionicons',
      action: onToggleMic,
      active: isMuted,
    },
    {
      id: 'torch',
      label: 'Flash',
      icon: torchActive ? 'flashlight' : 'flashlight-outline',
      iconFamily: 'Ionicons',
      action: onToggleTorch,
      active: torchActive,
    },
    {
      id: 'mirror',
      label: 'Mirror',
      icon: 'flip-horizontal',
      iconFamily: 'MaterialCommunityIcons',
      action: onToggleMirror,
      active: isMirrored,
    },
    {
      id: 'pk',
      label: 'PK Battle',
      icon: 'fire',
      iconFamily: 'MaterialCommunityIcons',
      action: onStartPkBattle,
      highlight: true,
    },
    {
      id: 'guests',
      label: 'Co-Host',
      icon: 'account-multiple-plus-outline',
      iconFamily: 'MaterialCommunityIcons',
      action: onOpenGuestManagement,
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.grabber} />

              <Text style={styles.sheetTitle}>Host LIVE Toolkit</Text>

              <View style={styles.toolsGrid}>
                {tools.map((tool) => (
                  <TouchableOpacity
                    key={tool.id}
                    style={[
                      styles.toolBtn,
                      tool.active && styles.toolBtnActive,
                      tool.highlight && styles.toolBtnHighlight,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      tool.action?.();
                      if (tool.id === 'pk' || tool.id === 'guests') {
                        onClose();
                      }
                    }}
                  >
                    <View style={styles.iconCircle}>
                      {tool.iconFamily === 'Ionicons' && (
                        <Ionicons
                          name={tool.icon as any}
                          size={24}
                          color={tool.highlight ? '#FFD700' : '#FFF'}
                        />
                      )}
                      {tool.iconFamily === 'MaterialCommunityIcons' && (
                        <MaterialCommunityIcons
                          name={tool.icon as any}
                          size={24}
                          color={tool.highlight ? '#FFD700' : '#FFF'}
                        />
                      )}
                    </View>
                    <Text style={styles.toolLabel}>{tool.label}</Text>
                  </TouchableOpacity>
                ))}
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
    backgroundColor: '#1E2026',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 14,
  },
  sheetTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    rowGap: 16,
  },
  toolBtn: {
    width: '30%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolBtnActive: {
    opacity: 0.8,
  },
  toolBtnHighlight: {
    // special glow for PK battle
  },
  toolLabel: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
});
