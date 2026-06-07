import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface AnalyzingScreenProps {
  isDarkMode: boolean;
}

const steps = [
  '파일을 안전하게 업로드하고 있어요.',
  '대화 참여자와 메시지 흐름을 정리하고 있어요.',
  '호감 신호와 위험 신호를 분리하고 있어요.',
  '판단 근거가 되는 실제 문장을 찾고 있어요.',
  '바로 읽기 좋은 리포트로 다듬고 있어요.',
];

const facts = [
  '질문이 오가는 흐름은 관계 관심도를 보는 중요한 단서예요.',
  '답장 속도보다 중요한 건 대화가 자연스럽게 이어지는지예요.',
  '짧은 리액션도 반복되면 긍정 신호가 될 수 있어요.',
  '캡처가 여러 장이면 순서대로 올릴수록 분석이 안정적이에요.',
  '분석 결과는 단정이 아니라 다음 대화를 위한 참고 지표예요.',
];

const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ isDarkMode }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  const theme = {
    background: isDarkMode ? '#111827' : '#F4F3FF',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    title: isDarkMode ? '#F9FAFB' : '#312E81',
    text: isDarkMode ? '#E5E7EB' : '#4C1D95',
    subText: isDarkMode ? '#C4B5FD' : '#7C3AED',
    muted: isDarkMode ? '#9CA3AF' : '#64748B',
    track: isDarkMode ? '#374151' : '#E9D5FF',
    wave1: isDarkMode ? '#312E81' : '#E0E7FF',
    wave2: isDarkMode ? '#4C1D95' : '#EDE9FE',
    wave3: isDarkMode ? '#6D28D9' : '#F5F3FF',
    factBg: isDarkMode ? '#111827' : '#F5F3FF',
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    Animated.loop(
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 4200,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.quad),
      }),
    ).start();
  }, [barAnim, pulseAnim, rotationAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex(prev => (prev + 1) % steps.length);
      setFactIndex(prev => (prev + 1) % facts.length);
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['18%', '92%'],
  });

  const visibleSteps = useMemo(
    () =>
      steps.map((step, index) => ({
        step,
        active: index === stepIndex,
        done: index < stepIndex,
      })),
    [stepIndex],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1, { backgroundColor: theme.wave1 }]} />
        <View style={[styles.waveCircle, styles.wave2, { backgroundColor: theme.wave2 }]} />
        <View style={[styles.waveCircle, styles.wave3, { backgroundColor: theme.wave3 }]} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Animated.View style={[styles.orbit, { transform: [{ rotate: spin }] }]}>
          <View style={styles.orbitDot} />
        </Animated.View>

        <Animated.View style={[styles.mainCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.aiText}>AI</Text>
        </Animated.View>

        <Text style={[styles.title, { color: theme.title }]}>대화의 신호를 읽는 중</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          관계 흐름, 판단 근거, 추천 멘트까지 정리하고 있어요.
        </Text>

        <View style={[styles.progressTrack, { backgroundColor: theme.track }]}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <View style={styles.stepList}>
          {visibleSteps.map(item => (
            <View key={item.step} style={styles.stepRow}>
              <View
                style={[
                  styles.stepDot,
                  { backgroundColor: item.active || item.done ? '#8B5CF6' : theme.track },
                ]}
              />
              <Text
                style={[
                  styles.stepText,
                  { color: item.active ? theme.text : theme.muted },
                  item.active && styles.stepTextActive,
                ]}
              >
                {item.step}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.factBox, { backgroundColor: theme.factBg }]}>
          <Text style={styles.factLabel}>기다리는 동안 참고하기</Text>
          <Text style={[styles.factText, { color: theme.muted }]}>{facts[factIndex]}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  waveLayerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  wave1: { width: width * 1.1, height: width * 1.1, opacity: 0.55 },
  wave2: { width: width * 0.86, height: width * 0.86, opacity: 0.5 },
  wave3: { width: width * 0.62, height: width * 0.62, opacity: 0.45 },
  card: {
    width: Math.min(width - 40, 420),
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    elevation: 6,
  },
  orbit: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: -92,
  },
  orbitDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  mainCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  aiText: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 21, marginBottom: 22 },
  progressTrack: {
    width: '100%',
    height: 9,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 22,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8B5CF6',
  },
  stepList: {
    width: '100%',
    gap: 10,
    marginBottom: 22,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  stepTextActive: { fontWeight: '900' },
  factBox: {
    width: '100%',
    borderRadius: 16,
    padding: 14,
  },
  factLabel: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
  },
  factText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },
});

export default AnalyzingScreen;
