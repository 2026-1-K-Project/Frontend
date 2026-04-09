import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

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
    <View style={styles.screenContainer}>
      <View style={styles.innerHeader}>
        <TouchableOpacity onPress={onReset} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.innerHeaderTitle}>분석 결과</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.resultContainer}>
        <View style={styles.resultCircle}>
          <Text style={styles.resultScoreValue}>{resultScore}%</Text>
          <Text style={styles.resultScoreLabel}>호감 지수</Text>
        </View>
        <View style={styles.resultBox}>
          <Text style={styles.resultMsg}>{getResultMsg()}</Text>
        </View>
        <TouchableOpacity style={styles.resetBtnLarge} onPress={onReset}>
          <Text style={styles.resetBtnTextLarge}>다시 하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerHeader: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 40, color: '#6366F1', marginTop: -5 },
  innerHeaderTitle: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  resultCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#E0E7FF',
    marginBottom: 50,
  },
  resultScoreValue: { fontSize: 75, fontWeight: '900', color: '#6366F1' },
  resultScoreLabel: { fontSize: 18, color: '#818CF8', fontWeight: '700', marginTop: -5 },
  resultBox: {
    backgroundColor: '#F8FAFC',
    padding: 25,
    borderRadius: 20,
    width: '100%',
    marginBottom: 50,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  resultMsg: { fontSize: 18, color: '#334155', textAlign: 'center', lineHeight: 28, fontWeight: '500' },
  resetBtnLarge: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  resetBtnTextLarge: { color: '#6366F1', fontSize: 18, fontWeight: '800' },
});

export default ResultScreen;
