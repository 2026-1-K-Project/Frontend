import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [isPushEnabled, setIsPushEnabled] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>푸시 알림</Text>
            <Switch
              value={isPushEnabled}
              onValueChange={setIsPushEnabled}
              trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
              thumbColor={isPushEnabled ? '#8B5CF6' : '#F3F4F6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>화면 설정</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>다크 모드</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
              thumbColor={isDarkMode ? '#8B5CF6' : '#F3F4F6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>앱 버전</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>문의하기</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>서비스 이용약관</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  headerRight: { width: 40 },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  chevron: {
    fontSize: 20,
    color: '#D1D5DB',
  },
});

export default SettingsScreen;
