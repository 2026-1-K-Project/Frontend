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

interface ArchiveDetailScreenProps {
  onBack: () => void;
  archiveData: {
    title: string;
    date: string;
    score: number;
    description: string;
    analysisResult: string;
  };
}

const ArchiveDetailScreen: React.FC<ArchiveDetailScreenProps> = ({ onBack, archiveData }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>분석 기록 상세</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{archiveData.score}</Text>
            <Text style={styles.scoreLabel}>호감도 점수</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.title}>{archiveData.title}</Text>
          <Text style={styles.date}>{archiveData.date}</Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.sectionTitle}>대화 내용 / 요청사항</Text>
          <Text style={styles.contentText}>{archiveData.description}</Text>
        </View>

        <View style={[styles.contentBox, styles.resultBox]}>
          <Text style={styles.sectionTitle}>AI 분석 결과</Text>
          <Text style={styles.resultText}>{archiveData.analysisResult}</Text>
        </View>
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
    paddingBottom: 60,
  },
  scoreSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF',
    borderWidth: 8,
    borderColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#7C3AED',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#94A3B8',
  },
  contentBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  resultBox: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  resultText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 26,
    fontWeight: '500',
  },
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

export default ArchiveDetailScreen;
