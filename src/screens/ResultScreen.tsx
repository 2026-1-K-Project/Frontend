import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  resultScore: number;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultScore, onReset }) => {

  // 섹션 타이틀 컴포넌트
  const SectionTitle = ({ title, emoji }: { title: string; emoji: string }) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 고정 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onReset} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>종합 분석 리포트</Text>
        <View style={styles.headerRight}>
          <Text style={styles.dotsIcon}>●●●</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 메인 요약 섹션 */}
        <View style={styles.summaryCard}>
          <View style={styles.resultCircle}>
            <Text style={styles.scoreValue}>{resultScore}%</Text>
            <Text style={styles.scoreLabel}>호감 지수</Text>
          </View>
          <Text style={styles.summaryText}>
            {resultScore > 80 ? "완벽한 싱크로율! 관계가 매우 깊습니다 ✨" :
             resultScore > 50 ? "긍정적인 기류가 흐르고 있어요. 조금만 더! 🔥" :
             "아직은 탐색기인 것 같아요. 대화가 더 필요합니다 🌱"}
          </Text>
        </View>

        {/* 1. 관계 역동성 및 호감도 분석 */}
        <SectionTitle title="관계 역동성 분석" emoji="📊" />
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>대화 점유율 (나 vs 상대방)</Text>
          <View style={styles.barChartContainer}>
            <View style={[styles.barLeft, { flex: 45 }]}><Text style={styles.barText}>나 45%</Text></View>
            <View style={[styles.barRight, { flex: 55 }]}><Text style={styles.barText}>상대 55%</Text></View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12분</Text>
              <Text style={styles.statLabel}>평균 답장</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>88%</Text>
              <Text style={styles.statLabel}>언어 동기화</Text>
            </View>
          </View>

          <View style={styles.chipContainer}>
            {['오늘 뭐해', '보고싶다', '웃겨', '카페', '내일'].map((word, i) => (
              <View key={i} style={styles.chip}><Text style={styles.chipText}>#{word}</Text></View>
            ))}
          </View>
        </View>

        {/* 2. 성격 및 심리 리포트 */}
        <SectionTitle title="성격 및 심리 분석" emoji="🧠" />
        <View style={styles.chartCard}>
          <View style={styles.mbtiRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>예상 MBTI: ENFP</Text></View>
            <View style={[styles.badge, {backgroundColor: '#EEF2FF'}]}><Text style={[styles.badgeText, {color: '#6366F1'}]}>안정형 애착</Text></View>
          </View>

          <Text style={styles.chartLabel}>Big Five 성격 지표</Text>
          <View style={styles.radarPlaceholder}>
            <View style={styles.radarInner} />
            <Text style={styles.radarLabelTop}>외향성</Text>
            <Text style={styles.radarLabelLeft}>친화성</Text>
            <Text style={styles.radarLabelRight}>성실성</Text>
          </View>
        </View>

        {/* 3. 감정 타임라인 */}
        <SectionTitle title="감정 타임라인" emoji="📈" />
        <View style={styles.chartCard}>
          <View style={styles.lineChartPlaceholder}>
            <View style={styles.lineChartPath} />
            <View style={[styles.dot, {left: '20%', bottom: '40%'}]} />
            <View style={[styles.dot, {left: '50%', bottom: '80%'}]} />
            <View style={[styles.dot, {left: '80%', bottom: '60%'}]} />
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.highlightTitle}>⭐ 결정적 순간</Text>
            <Text style={styles.highlightContent}>"내일 우리 같이 영화 볼래?" 라고 물었을 때 상대방의 호감도가 급상승했습니다.</Text>
          </View>
        </View>

        // 지영아 push할게

        {/* 4. 맞춤형 액션 가이드 */}
        <SectionTitle title="Actionable Insights" emoji="💡" />
        <View style={styles.guideCard}>
          <View style={styles.guideItem}>
            <Text style={styles.guideBullet}>✅</Text>
            <View>
              <Text style={styles.guideTextBold}>대화 꿀팁</Text>
              <Text style={styles.guideTextSub}>상대방의 관심사인 '여행' 주제를 더 깊게 파보세요.</Text>
            </View>
          </View>

          <View style={styles.guideItem}>
            <Text style={styles.guideBullet}>⚠️</Text>
            <View>
              <Text style={styles.guideTextBold}>주의할 점</Text>
              <Text style={styles.guideTextSub}>단답형 대답은 상대방을 위축되게 할 수 있습니다.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>추천 질문 리스트 보기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>처음으로 돌아가기</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* 배경 장식 */}
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, backgroundColor: '#FFF', zIndex: 100,
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  dotsIcon: { fontSize: 12, color: '#D1D5DB', letterSpacing: 2 },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, zIndex: 10 },

  // 메인 카드
  summaryCard: {
    backgroundColor: '#FFF', borderRadius: 30, padding: 30, alignItems: 'center',
    marginBottom: 25, elevation: 5, shadowColor: '#8B5CF6', shadowOpacity: 0.1, shadowRadius: 10,
  },
  resultCircle: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: '#F5F3FF',
    alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#A78BFA', marginBottom: 20,
  },
  scoreValue: { fontSize: 40, fontWeight: '900', color: '#7C3AED' },
  scoreLabel: { fontSize: 14, color: '#8B5CF6', fontWeight: '700' },
  summaryText: { fontSize: 18, fontWeight: '700', color: '#374151', textAlign: 'center', lineHeight: 26 },

  // 섹션 타이틀
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionEmoji: { fontSize: 20, marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },

  // 공통 카드 스타일
  chartCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#F1F5F9' },
  chartLabel: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 15 },

  // 바 차트
  barChartContainer: { height: 40, flexDirection: 'row', borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  barLeft: { backgroundColor: '#C4B5FD', justifyContent: 'center', alignItems: 'center' },
  barRight: { backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  barText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  divider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  chip: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },

  // 성격 분석
  mbtiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  badge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  badgeText: { fontSize: 14, fontWeight: '800', color: '#7C3AED' },

  radarPlaceholder: { height: 180, alignItems: 'center', justifyContent: 'center' },
  radarInner: {
    width: 100, height: 100, backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderWidth: 2, borderColor: '#A78BFA', transform: [{ rotate: '45deg' }]
  },
  radarLabelTop: { position: 'absolute', top: 10, fontSize: 12, fontWeight: '700' },
  radarLabelLeft: { position: 'absolute', left: 40, fontSize: 12, fontWeight: '700' },
  radarLabelRight: { position: 'absolute', right: 40, fontSize: 12, fontWeight: '700' },

  // 타임라인
  lineChartPlaceholder: { height: 120, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#E2E8F0', marginBottom: 20, padding: 10 },
  lineChartPath: { position: 'absolute', width: '100%', height: 2, backgroundColor: '#8B5CF6', top: '50%', transform: [{rotate: '-20deg'}] },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#7C3AED' },
  highlightCard: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  highlightTitle: { fontSize: 14, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  highlightContent: { fontSize: 13, color: '#4B5563', lineHeight: 20 },

  // 액션 가이드
  guideCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 25, marginBottom: 30 },
  guideItem: { flexDirection: 'row', marginBottom: 20 },
  guideBullet: { fontSize: 20, marginRight: 15 },
  guideTextBold: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  guideTextSub: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  actionButton: {
    backgroundColor: '#8B5CF6', paddingVertical: 15, borderRadius: 16, alignItems: 'center', marginTop: 10,
    shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 8, elevation: 3
  },
  actionButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  resetButton: { alignItems: 'center', padding: 20 },
  resetButtonText: { color: '#94A3B8', textDecorationLine: 'underline', fontWeight: '600' },

  waveLayerContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.1 },
  waveCircle: { position: 'absolute', width: width * 2, height: width * 2, borderRadius: width },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.5, left: -width * 0.5 },
});

export default ResultScreen;
