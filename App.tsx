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
          <View style={styles.startContainer}>
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

            {/* Bottom Home Indicator Area */}
            <View style={styles.homeIndicatorLine} />
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
                  placeholderTextColor="#94A3B8"
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
                <TouchableOpacity style={styles.resetBtnLarge} onPress={reset}>
                  <Text style={styles.resetBtnTextLarge}>다시 하기</Text>
                </TouchableOpacity>
             </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, currentScreen === 'START' && { backgroundColor: '#E6E6FA' }]}>
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
  // --- Start Screen (Full Screen, No Border) ---
  startContainer: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 25,
  },
  cardHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C3AED',
  },
  cardHeaderIcon: {
    fontSize: 32,
    color: '#7C3AED',
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 140,
    zIndex: 10,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bodyTextMain: {
    fontSize: 26,
    fontWeight: '600',
    color: '#4338CA',
    textAlign: 'center',
    lineHeight: 40,
  },
  gradientButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
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
  wave1: {
    backgroundColor: '#DDD6FE',
    bottom: -width * 1.3,
    left: -width * 0.4,
    opacity: 0.5,
  },
  wave2: {
    backgroundColor: '#C4B5FD',
    bottom: -width * 1.45,
    left: -width * 0.7,
    opacity: 0.6,
  },
  wave3: {
    backgroundColor: '#A78BFA',
    bottom: -width * 1.55,
    left: -width * 0.2,
    opacity: 0.8,
  },
  sparkle1: { position: 'absolute', bottom: '65%', left: '20%', color: '#FFF', fontSize: 20, opacity: 0.8 },
  sparkle2: { position: 'absolute', bottom: '80%', left: '40%', color: '#FFF', fontSize: 14, opacity: 0.6 },
  sparkle3: { position: 'absolute', bottom: '55%', right: '25%', color: '#FFF', fontSize: 24, opacity: 0.8 },
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
  // --- Other Screen Styles ---
  innerHeader: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  innerHeaderTitle: { fontSize: 18, fontWeight: '800' },
  backIcon: { fontSize: 40, color: '#6366F1' },
  inputArea: { flex: 1, padding: 25 },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    fontSize: 17,
    textAlignVertical: 'top',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#1E293B',
  },
  actionButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionButtonText: { color: '#FFF', fontSize: 19, fontWeight: '800' },
  disabledButton: { backgroundColor: '#CBD5E1' },
  centerFull: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingEmoji: { fontSize: 60, marginBottom: 20 },
  analyzingText: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultScoreLabel: { fontSize: 18, color: '#818CF8', fontWeight: '700' },
  resultScoreValue: { fontSize: 85, fontWeight: '900', color: '#6366F1' },
  resetBtnLarge: {
    marginTop: 50,
    width: '100%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  resetBtnTextLarge: { color: '#6366F1', fontWeight: '800', fontSize: 18 },
});

export default App;
