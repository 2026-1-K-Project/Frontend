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
  isDarkMode: boolean;
}

const ArchiveDetailScreen: React.FC<ArchiveDetailScreenProps> = ({
  onBack,
  archiveData,
  isDarkMode,
}) => {
  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFF',
    card: isDarkMode ? '#1F2937' : '#FFF',
    resultCard: isDarkMode ? '#312E81' : '#F5F3FF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    text: isDarkMode ? '#E5E7EB' : '#4B5563',
    subText: isDarkMode ? '#9CA3AF' : '#94A3B8',
    border: isDarkMode ? '#374151' : '#EEE',
    resultBorder: isDarkMode ? '#4C1D95' : '#DDD6FE',
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
          분석 기록 상세
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { backgroundColor: theme.card }]}>
            <Text style={styles.scoreText}>{archiveData.score}</Text>
            <Text style={[styles.scoreLabel, { color: theme.subText }]}>
              호감도 점수
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.title, { color: theme.title }]}>
            {archiveData.title}
          </Text>
          <Text style={[styles.date, { color: theme.subText }]}>
            {archiveData.date}
          </Text>
        </View>

        <View style={[styles.contentBox, { backgroundColor: theme.card }]}>
          <Text style={styles.sectionTitle}>대화 내용 / 요청사항</Text>
          <Text style={[styles.contentText, { color: theme.text }]}>
            {archiveData.description}
          </Text>
        </View>

        <View
          style={[
            styles.contentBox,
            styles.resultBox,
            {
              backgroundColor: theme.resultCard,
              borderColor: theme.resultBorder,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>AI 분석 결과</Text>
          <Text style={[styles.resultText, { color: theme.title }]}>
            {archiveData.analysisResult}
          </Text>
        </View>
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
    width: 40,
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
    width: 40,
  },
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
    borderWidth: 8,
    borderColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
  },
  contentBox: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  resultBox: {
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
    lineHeight: 22,
  },
  resultText: {
    fontSize: 16,
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

export default ArchiveDetailScreen;