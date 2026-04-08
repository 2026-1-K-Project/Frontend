import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
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

        <TouchableOpacity style={styles.gradientButton} onPress={onStart}>
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
};

const styles = StyleSheet.create({
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
});

export default StartScreen;
