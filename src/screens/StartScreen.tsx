import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface StartScreenProps {
  onStart: () => void;
  onOpenMypage: () => void;
  isDarkMode: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onOpenMypage,
  isDarkMode,
}) => {
  // 라이트/다크 모드에 따른 정밀 컬러 밸런싱
  const theme = {
    background: isDarkMode ? '#0B0F19' : '#F8F7FF',
    title: isDarkMode ? '#F8FAFC' : '#312E81',
    subText: isDarkMode ? '#94A3B8' : '#6B7280',
    tagText: isDarkMode ? '#A78BFA' : '#6D28D9',
    tagBg: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(109, 40, 217, 0.08)',
    mainText: isDarkMode ? '#F1F5F9' : '#1E1B4B',

    // [수정] 다크 모드일 때도 기본 버튼 배경색을 '진심'과 똑같은 연보라색(#A78BFA)으로 변경
    btnBg: isDarkMode ? '#A78BFA' : '#A78BFA',
    btnShadow: isDarkMode ? '#A78BFA' : '#C4B5FD',
    // [클릭 시] 다크 모드에서도 확실히 구분되도록 딥 바이올렛으로 전환
    btnBgActive: isDarkMode ? '#6D28D9' : '#6D28D9',
    btnShadowActive: isDarkMode ? '#6D28D9' : '#8B5CF6',

    // 웨이브 레이어 그라데이션 컬러
    wave1: isDarkMode ? '#1E1B4B' : '#EEF2FF',
    wave2: isDarkMode ? '#31108F' : '#E0E7FF',
    wave3: isDarkMode ? '#4C1D95' : '#C7D2FE',

    // 배경 색상에 따라 별 색상이 묻히지 않도록 연보라/화이트 분리 매핑
    sparkle: isDarkMode ? '#FFFFFF' : '#A78BFA',
    sparkleShadow: isDarkMode ? '#FFFFFF' : '#C4B5FD',

    // AI 무드 링 컬러
    blurRing: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(167, 139, 250, 0.2)',
    indicator: isDarkMode ? '#334155' : '#E2E8F0',
  };

  return (
    <View style={[styles.startContainer, { backgroundColor: theme.background }]}>
      {/* 배경 상단 오로라 무드 블러 링 */}
      <View style={[styles.topBlurRing, { backgroundColor: theme.blurRing }]} pointerEvents="none" />

      {/* 상단 반짝이 레이어 */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Text style={[styles.sparkle, styles.sparkleTop1, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
        <Text style={[styles.sparkle, styles.sparkleTop2, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
        <Text style={[styles.sparkle, styles.sparkleTop3, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
        <Text style={[styles.sparkle, styles.sparkleTop4, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
      </View>

      {/* 헤더 영역 */}
      <View style={styles.cardHeader}>
        <View style={{ width: 32 }} />
        <Text style={[styles.cardHeaderTitle, { color: theme.title }]}>
          AI 채팅 분석
        </Text>
        <Pressable
          onPress={onOpenMypage}
          style={({ pressed }) => [styles.menuButton, { opacity: pressed ? 0.7 : 1 }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.cardHeaderIcon, { color: theme.title }]}>≡</Text>
        </Pressable>
      </View>

      {/* 바디 콘텐츠 영역 */}
      <View style={styles.cardBody}>
        {/* 디자인 요소 2: 트렌디한 태그 뱃지 */}
        <View style={[styles.tagBadge, { backgroundColor: theme.tagBg }]}>
          <Text style={[styles.tagBadgeText, { color: theme.tagText }]}> ✨ 실시간 마음 분석기</Text>
        </View>

        {/* 메인 텍스트 그룹 */}
        <View style={styles.textGroup}>
          <Text style={[styles.bodyTextMain, { color: theme.mainText }]}>
            대화를 분석해
          </Text>
          <Text style={[styles.bodyTextMain, { color: theme.mainText }]}>
            상대의 <Text style={[styles.highlightText, { color: theme.tagText }]}>진심</Text>을 알아보세요
          </Text>
          {/* 디자인 요소 3: 서브 가이드 문구 */}
          <Text style={[styles.bodyTextSub, { color: theme.subText }]}>
            💡 주고받은 대화를 캡처하거나 복사해서 넣어보세요!
          </Text>
        </View>

        {/* 오직 클릭할 때(pressed)만 진해지는 메인 버튼 */}
        <Pressable
          style={({ pressed }) => [
            styles.gradientButton,
            {
              backgroundColor: pressed ? theme.btnBgActive : theme.btnBg,
              shadowColor: pressed ? theme.btnShadowActive : theme.btnShadow,
            }
          ]}
          onPress={onStart}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.gradientButtonText}>분석 시작하기</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </View>
        </Pressable>
      </View>

      {/* 하단 웨이브 및 대폭 풍부해진 스파클 그래픽 레이어 */}
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

        {/* 하단 반짝이(✦) 레이아웃 */}
        <Text style={[styles.sparkle, styles.sparkle2, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
        <Text style={[styles.sparkle, styles.sparkle4, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
        <Text style={[styles.sparkle, styles.sparkle6, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
        <Text style={[styles.sparkle, styles.sparkle7, { color: theme.sparkle, shadowColor: theme.sparkleShadow }]}>✦</Text>
      </View>

      {/* 하단 홈 인디케이터 바 */}
      <View
        style={[styles.homeIndicatorLine, { backgroundColor: theme.indicator }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  topBlurRing: {
    position: 'absolute',
    top: -height * 0.15,
    right: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 80,
      },
      android: {
        opacity: 0.4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingHorizontal: 24,
    zIndex: 20,
  },
  cardHeaderTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  cardHeaderIcon: {
    fontSize: 26,
    fontWeight: '600',
    marginTop: -4,
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: height * 0.12,
    zIndex: 10,
    paddingHorizontal: 32,
  },
  tagBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 20,
  },
  tagBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 44,
  },
  bodyTextMain: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  highlightText: {
    color: '#6D28D9',
  },
  bodyTextSub: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 14,
    letterSpacing: -0.3,
    opacity: 0.8,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 32,
    width: '100%',
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    marginTop: -1,
  },
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
    zIndex: 1,
  },
  waveCircle: {
    position: 'absolute',
    width: width * 2.4,
    height: width * 2.4,
    borderRadius: width * 1.2,
  },
  wave1: {
    bottom: -width * 1.5,
    left: -width * 0.6,
    opacity: 0.4,
  },
  wave2: {
    bottom: -width * 1.6,
    left: -width * 0.9,
    opacity: 0.5,
  },
  wave3: {
    bottom: -width * 1.7,
    left: -width * 0.3,
    opacity: 0.65,
  },
  sparkle: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  /* 상단 반짝이 스타일 세팅 */
  sparkleTop1: {
    top: height * 0.16,
    left: '12%',
    fontSize: 18,
    opacity: 0.5,
    ...Platform.select({ ios: { shadowOpacity: 0.5 } }),
  },
  sparkleTop2: {
    top: height * 0.12,
    right: '28%',
    fontSize: 14,
    opacity: 0.3,
    ...Platform.select({ ios: { shadowOpacity: 0.3 } }),
  },
  sparkleTop3: {
    top: height * 0.26,
    right: '10%',
    fontSize: 22,
    opacity: 0.6,
    ...Platform.select({ ios: { shadowOpacity: 0.6 } }),
  },
  sparkleTop4: {
    top: height * 0.34,
    left: '22%',
    fontSize: 15,
    opacity: 0.4,
    ...Platform.select({ ios: { shadowOpacity: 0.4 } }),
  },
  /* 하단 반짝이 스타일 세팅 */
  sparkle1: {
    bottom: '76%',
    left: '14%',
    fontSize: 24,
    opacity: 0.9,
    ...Platform.select({ ios: { shadowOpacity: 0.9 } }),
  },
  sparkle2: {
    bottom: '88%',
    left: '48%',
    fontSize: 15,
    opacity: 0.4,
    ...Platform.select({ ios: { shadowOpacity: 0.4 } }),
  },
  sparkle3: {
    bottom: '64%',
    right: '16%',
    fontSize: 28,
    opacity: 0.95,
    ...Platform.select({ ios: { shadowOpacity: 0.95 } }),
  },
  sparkle4: {
    bottom: '48%',
    left: '28%',
    fontSize: 14,
    opacity: 0.5,
    ...Platform.select({ ios: { shadowOpacity: 0.5 } }),
  },
  sparkle5: {
    bottom: '72%',
    right: '42%',
    fontSize: 18,
    opacity: 0.7,
    ...Platform.select({ ios: { shadowOpacity: 0.7 } }),
  },
  sparkle6: {
    bottom: '55%',
    left: '8%',
    fontSize: 16,
    opacity: 0.6,
    ...Platform.select({ ios: { shadowOpacity: 0.6 } }),
  },
  sparkle7: {
    bottom: '38%',
    right: '25%',
    fontSize: 20,
    opacity: 0.55,
    ...Platform.select({ ios: { shadowOpacity: 0.55 } }),
  },
  homeIndicatorLine: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    width: 120,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
});

export default StartScreen;