import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

type Screen = 'START' | 'INPUT' | 'ANALYZING' | 'RESULT';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('START');
  const [chatText, setChatText] = useState('');
  const [resultScore, setResultScore] = useState(0);

  const startAnalysis = () => setCurrentScreen('INPUT');
  const runAnalysis = () => {
    setCurrentScreen('ANALYZING');
    setTimeout(() => {
      const scores = [35, 62, 95];
      setResultScore(scores[Math.floor(Math.random() * scores.length)]);
      setCurrentScreen('RESULT');
    }, 2500);
  };
  const reset = () => {
    setChatText('');
    setCurrentScreen('START');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'START':
        return (
          <View style={styles.fullScreenContent}>
            {/* Main Card occupying the full screen with padding */}
            <View style={styles.mainCardFull}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={{ width: 30 }} />
                <Text style={styles.cardHeaderTitle}>AI 채팅 분석</Text>
                <TouchableOpacity>
                  <Text style={styles.cardHeaderIcon}>≡</Text>
                </TouchableOpacity>
              </View>

              {/* Body Content */}
              <View style={styles.cardBody}>
                <View style={styles.textGroup}>
                  <Text style={styles.bodyTextMain}>대화를 분석해</Text>
                  <Text style={styles.bodyTextMain}>상대의 마음을 알아보세요</Text>
                </View>

                <TouchableOpacity style={styles.gradientButton} onPress={startAnalysis}>
                  <Text style={styles.gradientButtonText}>분석 시작하기</Text>
                </TouchableOpacity>
              </View>

              {/* Decorative Waves */}
              <View style={styles.waveLayerContainer}>
                <View style={[styles.waveCircle, styles.wave1]} />
                <View style={[styles.waveCircle, styles.wave2]} />
                <View style={[styles.waveCircle, styles.wave3]} />
                <Text style={styles.sparkle1}>✦</Text>
                <Text style={styles.sparkle2}>✦</Text>
                <Text style={styles.sparkle3}>✦</Text>
              </View>

              {/* Bottom Home Indicator Line */}
              <View style={styles.bottomBar} />
            </View>
          </View>
        );

      case 'INPUT':
        return (
          <View style={styles.screenContainer}>
             <View style={styles.innerHeader}>
                <TouchableOpacity onPress={() => setCurrentScreen('START')}>
                   <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.innerHeaderTitle}>채팅 입력</Text>
                <View style={{ width: 40 }} />
             </View>
             <View style={styles.inputArea}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="분석할 내용을 입력하세요..."
                  value={chatText}
                  onChangeText={setChatText}
                />
                <TouchableOpacity
                  style={[styles.actionButton, !chatText && styles.disabledButton]}
                  onPress={runAnalysis}
                  disabled={!chatText}
                >
                  <Text style={styles.actionButtonText}>분석하기</Text>
                </TouchableOpacity>
             </View>
          </View>
        );

      case 'ANALYZING':
        return (
          <View style={styles.screenContainer}>
            <View style={styles.centerFull}>
              <Text style={styles.loadingEmoji}>✨</Text>
              <Text style={styles.analyzingText}>AI 분석 중...</Text>
            </View>
          </View>
        );

      case 'RESULT':
        return (
          <View style={styles.screenContainer}>
             <View style={styles.innerHeader}>
                <TouchableOpacity onPress={reset}>
                   <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.innerHeaderTitle}>분석 결과</Text>
                <View style={{ width: 40 }} />
             </View>
             <View style={styles.resultContainer}>
                <Text style={styles.resultScoreLabel}>호감도 지수</Text>
                <Text style={styles.resultScoreValue}>{resultScore}%</Text>
                <TouchableOpacity style={styles.resetBtn} onPress={reset}>
                  <Text style={styles.resetBtnText}>다시 하기</Text>
                </TouchableOpacity>
             </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  fullScreenContent: {
    flex: 1,
    backgroundColor: '#F3F4F9', // Subtle background color
    padding: 12, // Margin around the main card to show the "frame" effect
  },
  mainCardFull: {
    flex: 1,
    backgroundColor: '#E6E6FA', // Lavender background from the image
    borderRadius: 45,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F0F0FF',
    // Shadow for depth
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 25,
  },
  cardHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C3AED',
  },
  cardHeaderIcon: {
    fontSize: 30,
    color: '#7C3AED',
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    zIndex: 10,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bodyTextMain: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4338CA',
    textAlign: 'center',
    lineHeight: 36,
  },
  gradientButton: {
    marginTop: 20,
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 22,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradientButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
  },
  waveCircle: {
    position: 'absolute',
    width: width * 1.8,
    height: width * 1.8,
    borderRadius: width * 0.9,
  },
  wave1: {
    backgroundColor: '#DDD6FE',
    bottom: -width * 1.25,
    left: -width * 0.3,
    opacity: 0.45,
  },
  wave2: {
    backgroundColor: '#C4B5FD',
    bottom: -width * 1.35,
    left: -width * 0.6,
    opacity: 0.65,
  },
  wave3: {
    backgroundColor: '#A78BFA',
    bottom: -width * 1.42,
    left: -width * 0.1,
    opacity: 0.85,
  },
  sparkle1: { position: 'absolute', bottom: '60%', left: '25%', color: '#FFF', fontSize: 18, opacity: 0.7 },
  sparkle2: { position: 'absolute', bottom: '75%', left: '40%', color: '#FFF', fontSize: 14, opacity: 0.5 },
  sparkle3: { position: 'absolute', bottom: '55%', right: '25%', color: '#FFF', fontSize: 22, opacity: 0.8 },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 140,
    height: 6,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    opacity: 0.3,
  },
  // Inner screens styles
  innerHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  innerHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  backIcon: { fontSize: 32, color: '#6366F1' },
  inputArea: { flex: 1, padding: 20 },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#6366F1',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  disabledButton: { backgroundColor: '#C7D2FE' },
  centerFull: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingEmoji: { fontSize: 50, marginBottom: 20 },
  analyzingText: { fontSize: 20, fontWeight: '600', color: '#4B5563' },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultScoreLabel: { fontSize: 18, color: '#6B7280', marginBottom: 10 },
  resultScoreValue: { fontSize: 80, fontWeight: '900', color: '#6366F1', marginBottom: 40 },
  resetBtn: { padding: 10 },
  resetBtnText: { color: '#6366F1', fontSize: 16, textDecorationLine: 'underline' },
});

export default App;
