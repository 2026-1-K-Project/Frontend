import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  resultScore: number;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultScore, onReset }) => {
  const getResultMsg = () => {
    if (resultScore > 80) return "매우 긍정적입니다! 관계가 아주 좋아요 ✨";
    if (resultScore > 50) return "긍정적인 신호가 보여요. 조금 더 다가가 보세요!";
    return "아직은 노력이 필요해 보여요. 대화를 더 나눠보세요.";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onReset} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>분석 결과</Text>
        <View style={styles.headerRight}>
          <Text style={styles.dotsIcon}>●●●</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.resultCircle}>
          <Text style={styles.scoreValue}>{resultScore}%</Text>
          <Text style={styles.scoreLabel}>호감 지수</Text>
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{getResultMsg()}</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>다시 하기</Text>
        </TouchableOpacity>
      </View>

      {/* Template Background Elements */}
      <View style={styles.waveLayerContainer}>
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
        <View style={[styles.waveCircle, styles.wave3]} />
      </View>
      <View style={styles.homeIndicatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  dotsIcon: { fontSize: 12, color: '#D1D5DB', letterSpacing: 2 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    zIndex: 10,
  },
  resultCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#A78BFA',
    marginBottom: 40,
    elevation: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  scoreValue: {
    fontSize: 70,
    fontWeight: '900',
    color: '#7C3AED',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: '700',
    marginTop: -5,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 25,
    borderRadius: 20,
    width: width * 0.85,
    marginBottom: 40,
  },
  messageText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
  resetButton: {
    width: width * 0.7,
    height: 60,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  // Wave Template
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
  },
  waveCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
  },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.3, left: -width * 0.4, opacity: 0.5 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.45, left: -width * 0.7, opacity: 0.6 },
  wave3: { backgroundColor: '#A78BFA', bottom: -width * 1.55, left: -width * 0.2, opacity: 0.8 },
  homeIndicatorLine: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 140,
    height: 5,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    opacity: 0.3,
  },
});

export default ResultScreen;
