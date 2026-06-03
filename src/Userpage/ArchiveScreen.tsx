import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ArchiveScreenProps {
  onBack: () => void;
  onSelectDetail: (archive: any) => void;
  archives: any[];
  onDelete: (id: number) => void;
  isDarkMode: boolean;
}

const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  onBack,
  onSelectDetail,
  archives,
  onDelete,
  isDarkMode,
}) => {
  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFF',
    card: isDarkMode ? '#1F2937' : '#FFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#94A3B8',
    border: isDarkMode ? '#374151' : '#EEE',
    badgeBg: isDarkMode ? '#312E81' : '#F5F3FF',
    wave1: isDarkMode ? '#312E81' : '#DDD6FE',
    wave2: isDarkMode ? '#4C1D95' : '#C4B5FD',
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
          보관함
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {archives.length > 0 ? (
          archives.map(item => (
            <View key={item.id} style={styles.archiveCardContainer}>
              <TouchableOpacity
                style={[
                  styles.archiveCard,
                  { backgroundColor: theme.card },
                ]}
                onPress={() => onSelectDetail(item)}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.title }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardDate, { color: theme.subText }]}>
                    {item.date}
                  </Text>
                </View>

                <View
                  style={[
                    styles.scoreBadge,
                    { backgroundColor: theme.badgeBg },
                  ]}
                >
                  <Text style={styles.scoreText}>{item.score}%</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteIconButton}
                onPress={() => onDelete(item.id)}
              >
                <Text style={styles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              보관된 분석 결과가 없습니다.
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
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { width: 40 },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  archiveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  archiveCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  deleteIconButton: {
    padding: 10,
    marginLeft: 5,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#EF4444',
    opacity: 0.6,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
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

export default ArchiveScreen;