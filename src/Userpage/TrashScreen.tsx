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
}

const TrashScreen: React.FC<TrashScreenProps> = ({ 
  onBack, 
  trashItems, 
  onRestore, 
  onDeletePermanently,
  onEmptyTrash 
}) => {
  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return;
    Alert.alert(
      '휴지통 비우기',
      '모든 항목을 영구적으로 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: onEmptyTrash }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>휴지통</Text>
        <TouchableOpacity onPress={handleEmptyTrash} style={styles.headerRight}>
          <Text style={styles.emptyTrashText}>비우기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {trashItems.length > 0 ? (
          trashItems.map((item) => (
            <View key={item.id} style={styles.archiveCard}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date} 삭제됨</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.restoreBtn} 
                  onPress={() => onRestore(item)}
                >
                  <Text style={styles.restoreText}>복원</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => onDeletePermanently(item.id)}
                >
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>휴지통이 비어 있습니다.</Text>
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
  headerBtn: { width: 60 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  headerRight: { width: 60, alignItems: 'flex-end' },
  emptyTrashText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  archiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#94A3B8', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#CBD5E1' },
  actionButtons: { flexDirection: 'row' },
  restoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    marginRight: 8,
  },
  restoreText: { color: '#7C3AED', fontWeight: '600', fontSize: 13 },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  deleteText: { color: '#EF4444', fontWeight: '600', fontSize: 13 },
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
    zIndex: -1,
  },
  waveCircle: { position: 'absolute', width: width * 1.5, height: width * 1.5, borderRadius: width },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.2, left: -width * 0.3 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.3, left: -width * 0.6 },
});

export default TrashScreen;
