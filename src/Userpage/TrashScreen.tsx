import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

interface TrashScreenProps {
  onBack: () => void;
  trashItems: any[];
  onRestore: (item: any) => void;
  onDeletePermanently: (id: number) => void;
  onEmptyTrash: () => void;
  isDarkMode: boolean;
}

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
    header: isDarkMode ? '#1F2937' : '#FFF',
    card: isDarkMode ? '#1F2937' : '#FFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#94A3B8',
    border: isDarkMode ? '#374151' : '#EEE',
    restoreBg: isDarkMode ? '#312E81' : '#F5F3FF',
    deleteBg: isDarkMode ? '#3F1D1D' : '#FEF2F2',
    wave1: isDarkMode ? '#312E81' : '#DDD6FE',
    wave2: isDarkMode ? '#4C1D95' : '#C4B5FD',
  };

  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return;

    Alert.alert(
      '휴지통 비우기',
      '모든 항목을 영구적으로 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: onEmptyTrash,
        },
      ],
    );
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

        <Text style={[styles.headerTitle, { color: theme.title }]}>
          휴지통
        </Text>

        <TouchableOpacity
          onPress={handleEmptyTrash}
          style={styles.headerRight}
        >
          <Text style={styles.emptyTrashText}>비우기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {trashItems.length > 0 ? (
          trashItems.map(item => (
            <View
              key={item.id}
              style={[
                styles.archiveCard,
                { backgroundColor: theme.card },
              ]}
            >
              <View style={styles.cardInfo}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.subText },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardDate,
                    { color: theme.subText },
                  ]}
                >
                  {item.date} 삭제됨
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.restoreBtn,
                    { backgroundColor: theme.restoreBg },
                  ]}
                  onPress={() => onRestore(item)}
                >
                  <Text style={styles.restoreText}>복원</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteBtn,
                    { backgroundColor: theme.deleteBg },
                  ]}
                  onPress={() => onDeletePermanently(item.id)}
                >
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: theme.subText },
              ]}
            >
              휴지통이 비어 있습니다.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View
          style={[
            styles.waveCircle,
            styles.wave1,
            { backgroundColor: theme.wave1 },
          ]}
        />
        <View
          style={[
            styles.waveCircle,
            styles.wave2,
            { backgroundColor: theme.wave2 },
          ]}
        />
      </View>
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
  headerBtn: {
    width: 60,
  },
  backIcon: {
    fontSize: 40,
    color: '#8B5CF6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  emptyTrashText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  archiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  restoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  restoreText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    opacity: 0.2,
    zIndex: -1,
  },
  waveCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
  },
  wave1: {
    bottom: -width * 1.2,
    left: -width * 0.3,
  },
  wave2: {
    bottom: -width * 1.3,
    left: -width * 0.6,
  },
});

export default TrashScreen;