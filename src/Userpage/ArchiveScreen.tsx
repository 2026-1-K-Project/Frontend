import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ReportListItem } from '../types/Api';

const { width } = Dimensions.get('window');

interface ArchiveScreenProps {
  onBack: () => void;
  onSelectDetail: (archive: ReportListItem) => void;
  archives: ReportListItem[];
  onDelete: (reportId: number) => void;
  isDarkMode: boolean;
}

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toLocaleDateString();
};

const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  onBack,
  onSelectDetail,
  archives,
  onDelete,
  isDarkMode,
}) => {
  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFFFFF',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#374151' : '#E2E8F0',
    badgeBg: isDarkMode ? '#312E81' : '#F5F3FF',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.title }]}>보관함</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {archives.length > 0 ? (
          archives.map(item => (
            <View key={item.reportId} style={styles.cardRow}>
              <TouchableOpacity
                style={[styles.archiveCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => onSelectDetail(item)}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.title }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardMeta, { color: theme.subText }]}>
                    {formatDate(item.createdAt)} · {item.category} · 파일 {item.uploadedFileCount}개
                  </Text>
                  {!!item.description && (
                    <Text style={[styles.cardDescription, { color: theme.subText }]} numberOfLines={1}>
                      {item.description}
                    </Text>
                  )}
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: theme.badgeBg }]}>
                  <Text style={styles.scoreText}>{item.resultScore}%</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.reportId)}>
                <Text style={styles.deleteText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              아직 보관된 분석 결과가 없습니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  headerButton: { width: 44 },
  backText: { fontSize: 42, color: '#8B5CF6', lineHeight: 42 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  scrollContent: { padding: 18, paddingBottom: 80 },
  cardRow: {
    width: Math.min(width - 36, 460),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  archiveCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, paddingRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', marginBottom: 5 },
  cardMeta: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  cardDescription: { fontSize: 12, fontWeight: '600' },
  scoreBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  scoreText: { fontSize: 14, fontWeight: '900', color: '#7C3AED' },
  deleteButton: { paddingHorizontal: 8, paddingVertical: 10, marginLeft: 4 },
  deleteText: { fontSize: 13, fontWeight: '900', color: '#EF4444' },
  emptyContainer: { marginTop: 120, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '700' },
});

export default ArchiveScreen;
