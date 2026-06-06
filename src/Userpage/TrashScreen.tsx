import React from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ReportListItem } from '../types/Api';

const { width } = Dimensions.get('window');

interface TrashScreenProps {
  onBack: () => void;
  trashItems: ReportListItem[];
  onRestore: (item: ReportListItem) => void;
  onDeletePermanently: (reportId: number) => void;
  onEmptyTrash: () => void;
  isDarkMode: boolean;
}

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toLocaleDateString();
};

const TrashScreen: React.FC<TrashScreenProps> = ({
  onBack,
  trashItems,
  onRestore,
  onDeletePermanently,
  onEmptyTrash,
  isDarkMode,
}) => {
  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFFFFF',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#374151' : '#E2E8F0',
  };

  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return;
    Alert.alert('휴지통 비우기', '휴지통의 모든 리포트를 영구 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: onEmptyTrash },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.title }]}>휴지통</Text>
        <TouchableOpacity onPress={handleEmptyTrash} style={styles.headerButton}>
          <Text style={styles.emptyTextButton}>비우기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {trashItems.length > 0 ? (
          trashItems.map(item => (
            <View key={item.reportId} style={[styles.trashCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: theme.title }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.cardDate, { color: theme.subText }]}>
                  {formatDate(item.trashedAt || item.createdAt)} 삭제됨
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.restoreButton} onPress={() => onRestore(item)}>
                  <Text style={styles.restoreText}>복구</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDeletePermanently(item.reportId)}>
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>휴지통이 비어 있습니다.</Text>
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
  headerButton: { width: 60 },
  backText: { fontSize: 42, color: '#8B5CF6', lineHeight: 42 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  emptyTextButton: { color: '#EF4444', fontSize: 13, fontWeight: '900', textAlign: 'right' },
  scrollContent: { padding: 18, paddingBottom: 80 },
  trashCard: {
    width: Math.min(width - 36, 460),
    alignSelf: 'center',
    minHeight: 82,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardInfo: { flex: 1, paddingRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', marginBottom: 5 },
  cardDate: { fontSize: 12, fontWeight: '700' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  restoreButton: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  restoreText: { color: '#7C3AED', fontSize: 13, fontWeight: '900' },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  deleteText: { color: '#EF4444', fontSize: 13, fontWeight: '900' },
  emptyContainer: { marginTop: 120, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '700' },
});

export default TrashScreen;
