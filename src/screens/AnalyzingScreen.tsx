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

interface AnalyzingScreenProps {
  isDarkMode: boolean;
}

const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ isDarkMode }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  // [추정 수정] 로딩 바가 멈춰있지 않고 무한히 흐르도록 애니메이션 값 추가
  const barProgressAnim = useRef(new Animated.Value(-width * 0.6)).current;

  // [수정] 메인 컬러 및 인디케이터 컬러를 한층 연하고 부드러운 연보라색 계열로 최적화
  const theme = {
    background: isDarkMode ? '#111827' : '#F4F3FF', // 라이트 모드 배경을 조금 더 맑은 연보라 빛으로 수정
    circle: isDarkMode ? '#1F2937' : '#FFF',
    mainText: isDarkMode ? '#F9FAFB' : '#6366F1',   // 진한 인디고에서 부드러운 연보라/블루스톤 계열로 수정
    subText: isDarkMode ? '#C4B5FD' : '#A78BFA',    // 라이트 모드 서브 텍스트를 연보라색으로 변경
    loadingBg: isDarkMode
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(167, 139, 250, 0.2)', // 로딩바 배경도 부드러운 연보라 투명도로 매칭
    wave1: isDarkMode ? '#312E81' : '#E0E7FF',
    wave2: isDarkMode ? '#4C1D95' : '#EDE9FE',
    wave3: isDarkMode ? '#6D28D9' : '#F5F3FF',
    indicator: isDarkMode ? '#C4B5FD' : '#A78BFA',  // 메인 로딩 바와 하단 선을 화사한 연보라색으로 변경
  };

  useEffect(() => {
    // 중앙 원 펄스 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    ).start();

    // 반짝이 회전 애니메이션
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // [수정] 하단 로딩 바가 끊임없이 부드럽게 흐르는 무한 루프 애니메이션
    Animated.loop(
      Animated.timing(barProgressAnim, {
        toValue: width * 0.6,
        duration: 1800,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotationAnim, barProgressAnim]);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
        <View
          style={[
            styles.waveCircle,
            styles.wave3,
            { backgroundColor: theme.wave3 },
          ]}
        />
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.mainCircle,
            {
              backgroundColor: theme.circle,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.aiIcon}>🤍</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.sparkleContainer,
            { transform: [{ rotate: spin }] },
          ]}
        >

        </Animated.View>

        <View style={styles.textContainer}>
          {/* [수정] 타이틀 및 서브 텍스트 문구 퀄리티 고급화 */}
          <Text style={[styles.mainText, { color: theme.mainText }]}>
            두 분의 대화 속 진심을 분석하고 있어요!
          </Text>
          <Text style={[styles.subText, { color: theme.subText }]}>
            숨겨진 감정 시그널을 찾아내는 중입니다...
          </Text>
        </View>

        <View style={[styles.loadingBarBg, { backgroundColor: theme.loadingBg }]}>
          {/* [수정] 정적으로 멈춰있던 바를 흐르는 애니메이션 뷰로 교체 */}
          <Animated.View
            style={[
              styles.loadingBarFill,
              {
                backgroundColor: theme.indicator,
                transform: [{ translateX: barProgressAnim }]
              }
            ]}
          />
        </View>
      </View>

      <View
        style={[
          styles.homeIndicatorLine,
          { backgroundColor: theme.indicator },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  mainCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    /* [수정] 그림자 컬러 역시 진보라에서 은은한 파스텔 연보라색(#A78BFA)으로 변경 */
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    marginBottom: 44,
  },
  aiIcon: {
    fontSize: 54,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -25,
    width: 190,
    height: 190,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  outerSparkle: {
    fontSize: 26,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 35,
    paddingHorizontal: 20,
  },
  /* [수정] 텍스트 크기 밸런스 및 폰트 무드 세련되게 변경 */
  mainText: {
    fontSize: 19.5,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14.5,
    fontWeight: '500',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  loadingBarBg: {
    width: width * 0.55,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  /* [수정] 무한 로딩 바 크기 및 형태 정의 */
  loadingBarFill: {
    height: '100%',
    width: '50%', // 전체 트랙의 절반 크기로 바를 형성하여 좌우로 흐르게 조절
    borderRadius: 3,
    position: 'absolute',
    left: 0,
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
    bottom: -width * 1.3,
    left: -width * 0.4,
    opacity: 0.5,
  },
  wave2: {
    bottom: -width * 1.45,
    left: -width * 0.7,
    opacity: 0.6,
  },
  wave3: {
    bottom: -width * 1.55,
    left: -width * 0.2,
    opacity: 0.8,
  },
  homeIndicatorLine: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 140,
    height: 5,
    borderRadius: 10,
    opacity: 0.15,
  },
});

export default AnalyzingScreen;