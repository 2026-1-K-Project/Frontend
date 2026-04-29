import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

const { width } = Dimensions.get('window');

const AnalyzingScreen: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the central circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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
      ])
    ).start();

    // Rotation animation for the sparkles
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Decorative Waves (Background) */}
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
        <View style={[styles.waveCircle, styles.wave3]} />
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.mainCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.aiIcon}>✨</Text>
        </Animated.View>

        <Animated.View style={[styles.sparkleContainer, { transform: [{ rotate: spin }] }]}>
          <Text style={styles.outerSparkle}>✦</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>AI가 대화를 정밀 분석 중입니다</Text>
          <Text style={styles.subText}>잠시만 기다려주세요...</Text>
        </View>

        <View style={styles.loadingBarBg}>
          <Animated.View style={styles.loadingBarFill} />
        </View>
      </View>

      <View style={styles.homeIndicatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  mainCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginBottom: 40,
  },
  aiIcon: {
    fontSize: 60,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -20,
    width: 200,
    height: 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  outerSparkle: {
    fontSize: 24,
    color: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4338CA',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#7C3AED',
    opacity: 0.8,
  },
  loadingBarBg: {
    width: width * 0.6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    width: '40%', // This would ideally be animated or a simple activity indicator
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
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

export default AnalyzingScreen;
