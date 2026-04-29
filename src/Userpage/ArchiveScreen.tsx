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
}

const ArchiveScreen: React.FC<ArchiveScreenProps> = ({ 
  onBack, 
  onSelectDetail, 
  archives,
  onDelete 
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>보관함</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {archives.length > 0 ? (
          archives.map((item) => (
            <View key={item.id} style={styles.archiveCardContainer}>
              <TouchableOpacity 
                style={styles.archiveCard} 
                onPress={() => onSelectDetail(item)}
              >
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
                <View style={styles.scoreBadge}>
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
            <Text style={styles.emptyText}>보관된 분석 결과가 없습니다.</Text>
          </View>
        )}
      </ScrollView>

      {/* Decorative Waves */}
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
      </View>
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
    backgroundColor: '#FFF',
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
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#94A3B8' },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  scoreText: { fontSize: 14, fontWeight: '700', color: '#7C3AED' },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: { color: '#94A3B8', fontSize: 16 },
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    opacity: 0.2,
  },
  waveCircle: { position: 'absolute', width: width * 1.5, height: width * 1.5, borderRadius: width },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.2, left: -width * 0.3 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.3, left: -width * 0.6 },
});

export default ArchiveScreen;
