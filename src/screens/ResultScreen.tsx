import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Share,
  Modal,
  Pressable,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ResultScreenProps {
  resultScore: number;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultScore, onReset }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 저장 성공 모달 상태 관리
  const [saveStatus, setSaveStatus] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  const onShare = async () => {
    setIsMenuOpen(false);
    try {
      await Share.share({
        message: `나의 AI 채팅 분석 결과: 호감 지수 ${resultScore}%! 여러분도 분석해보세요! ✨`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const onSave = (type: string) => {
    setIsMenuOpen(false);
    
    // 앱 테마에 맞는 커스텀 성공 화면 데이터 설정
    setTimeout(() => {
      setSaveStatus({
        visible: true,
        title: type === "이미지로 저장" ? "갤러리 저장 완료" : "보관함 저장 완료",
        message: type === "이미지로 저장" 
          ? "분석 리포트가 사진첩에\n안전하게 저장되었습니다! ✨" 
          : "나중에 마이페이지 > 보관함에서\n이 기록을 다시 확인할 수 있어요. 📦",
      });
    }, 400);
  };

  const onDelete = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      Alert.alert(
        "기록 삭제", 
        "정말 이 분석 리포트를 삭제하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          { text: "삭제", onPress: onReset, style: "destructive" }
        ]
      );
    }, 500);
  };

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
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerRight}>
          <View style={styles.exportBadge}>
            <Text style={styles.exportIconText}>📤</Text>
          </View>
        </TouchableOpacity>
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

      {/* 1. 리포트 관리 메뉴 모달 */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHandle} />
            <Text style={styles.menuTitle}>리포트 관리 📤</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={onShare}>
              <View style={[styles.menuIconBox, {backgroundColor: '#F5F3FF'}]}>
                <Text style={styles.menuIcon}>📱</Text>
              </View>
              <Text style={styles.menuItemText}>결과 공유하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onSave("이미지로 저장")}>
              <View style={[styles.menuIconBox, {backgroundColor: '#F5F3FF'}]}>
                <Text style={styles.menuIcon}>🖼️</Text>
              </View>
              <Text style={styles.menuItemText}>이미지로 저장 (갤러리)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onSave("보관함 저장")}>
              <View style={[styles.menuIconBox, {backgroundColor: '#F5F3FF'}]}>
                <Text style={styles.menuIcon}>📦</Text>
              </View>
              <Text style={styles.menuItemText}>내 보관함에 저장</Text>
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <TouchableOpacity style={[styles.menuItem, styles.deleteItem]} onPress={onDelete}>
              <View style={[styles.menuIconBox, {backgroundColor: '#FEF2F2'}]}>
                <Text style={styles.menuIcon}>🗑️</Text>
              </View>
              <Text style={[styles.menuItemText, {color: '#EF4444'}]}>이 기록 삭제하기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setIsMenuOpen(false)}
            >
              <Text style={styles.cancelButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* 2. 저장 성공 커스텀 모달 (Success UI) */}
      <Modal
        visible={saveStatus.visible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>{saveStatus.title}</Text>
            <Text style={styles.successMessage}>{saveStatus.message}</Text>
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={() => setSaveStatus({ ...saveStatus, visible: false })}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sparkle, { top: '35%', left: '20%' }]}>✦</Text>
          <Text style={[styles.sparkle, { top: '30%', right: '25%' }]}>✧</Text>
        </View>
      </Modal>

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
  headerRight: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
  exportBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportIconText: { fontSize: 16 },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, zIndex: 10 },

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

  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionEmoji: { fontSize: 20, marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },

  chartCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#F1F5F9' },
  chartLabel: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 15 },

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

  lineChartPlaceholder: { height: 120, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#E2E8F0', marginBottom: 20, padding: 10 },
  lineChartPath: { position: 'absolute', width: '100%', height: 2, backgroundColor: '#8B5CF6', top: '50%', transform: [{rotate: '-20deg'}] },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#7C3AED' },
  highlightCard: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  highlightTitle: { fontSize: 14, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  highlightContent: { fontSize: 13, color: '#4B5563', lineHeight: 20 },

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

  // 모달 스타일 (공통)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  menuHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 25,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 15,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: { fontSize: 20 },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },

  // 성공 모달 스타일 (추가됨)
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#C4B5FD',
  },
  successIcon: {
    fontSize: 40,
    color: '#8B5CF6',
    fontWeight: '800',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sparkle: {
    position: 'absolute',
    color: '#FFF',
    fontSize: 24,
    opacity: 0.8,
  },
});

export default ResultScreen;
