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
  isDarkMode: boolean;
  onChangeDarkMode: (value: boolean) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  isDarkMode,
  onChangeDarkMode,
}) => {
  const [isPushEnabled, setIsPushEnabled] = React.useState(true);

  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFF',
    card: isDarkMode ? '#1F2937' : '#FFF',
    border: isDarkMode ? '#374151' : '#EEE',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#94A3B8',
    chevron: isDarkMode ? '#6B7280' : '#D1D5DB',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.header,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.title }]}>설정</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            알림 설정
          </Text>

          <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
            <Text style={[styles.settingLabel, { color: theme.title }]}>
              푸시 알림
            </Text>

            <Switch
              value={isPushEnabled}
              onValueChange={setIsPushEnabled}
              trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
              thumbColor={isPushEnabled ? '#8B5CF6' : '#F3F4F6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            화면 설정
          </Text>

          <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
            <Text style={[styles.settingLabel, { color: theme.title }]}>
              다크 모드
            </Text>

            <Switch
              value={isDarkMode}
              onValueChange={onChangeDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
              thumbColor={isDarkMode ? '#8B5CF6' : '#F3F4F6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            정보
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.settingLabel, { color: theme.title }]}>
              앱 버전
            </Text>
            <Text style={[styles.versionText, { color: theme.subText }]}>
              1.0.0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.settingLabel, { color: theme.title }]}>
              문의하기
            </Text>
            <Text style={[styles.chevron, { color: theme.chevron }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.settingLabel, { color: theme.title }]}>
              서비스 이용약관
            </Text>
            <Text style={[styles.chevron, { color: theme.chevron }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
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
    marginBottom: 10,
    marginLeft: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 20,
  },
});

export default SettingsScreen;