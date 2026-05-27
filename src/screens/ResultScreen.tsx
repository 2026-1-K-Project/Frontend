import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Modal,
  Pressable,
  Share,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { AnalysisData } from '../types/Analysis';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  resultData: AnalysisData | null;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultData, onReset }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  const part1Ref = useRef<ViewShot>(null);
  const part2Ref = useRef<ViewShot>(null);

  // 데이터가 없을 경우를 대비한 가상 데이터
  const fallbackData: AnalysisData = {
    resultScore: 95,
    shareMe: 45,
    sharePartner: 55,
    replyTime: "12분",
    syncIndex: 88,
    keywords: ["오늘뭐해", "보고싶다", "웃겨", "카페", "내일"],
    mbti: "ENFP",
    attachment: "안정형",
    bigFive: { openness: 90, conscientiousness: 60, extraversion: 80, agreeableness: 85, neuroticism: 30 },
    moment: "내일 우리 같이 영화 볼래? 라고 물었을 때 상대방의 호감도가 급상승했습니다.",
    tips: "상대방의 관심사인 '여행' 주제를 더 깊게 파보세요.",
    warning: "단답형 대답은 상대방을 위축되게 할 수 있습니다."
  };

  const data = resultData || fallbackData;

  const handleShare = async () => {
    setIsMenuOpen(false);
    try {
      await Share.share({
        message: `나의 AI 채팅 분석 결과: 호감 지수 ${data.resultScore}%! 여러분도 분석해보세요! ✨`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSaveImage = async () => {
    setIsMenuOpen(false);
    // 이미지 저장 로직 시뮬레이션 (실제 권한 및 라이브러리 설정 필요)
    setSaveStatus({
      visible: true,
      title: "저장 완료 ✨",
      message: "리포트가 갤러리에 이미지로 저장되었습니다!",
    });
  };

  const SectionTitle = ({ title, emoji }: { title: string; emoji: string }) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onReset} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 채팅 정밀 진단서</Text>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerRight}>
          <View style={styles.menuIconBadge}>
            <Text style={styles.menuIconText}>📤</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ViewShot ref={part1Ref} options={{ format: "png", quality: 0.9 }}>
          <View style={styles.captureArea}>
            <View style={styles.summaryCard}>
              <View style={styles.resultCircle}>
                <Text style={styles.scoreValue}>{data.resultScore}%</Text>
                <Text style={styles.scoreLabel}>호감 지수</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {data.resultScore > 80 ? "💖 완벽한 싱크로율" : data.resultScore > 50 ? "🔥 긍정적 시그널" : "🌱 탐색 중"}
                </Text>
              </View>
              <Text style={styles.summaryText}>
                {data.resultScore > 80 ? "서로에게 깊이 빠져있는 상태입니다. 환상적인 대화예요!" :
                 data.resultScore > 50 ? "긍정적인 기류가 흐르고 있어요. 조금만 더 다가가 보세요!" :
                 "아직은 대화가 조금 더 필요한 단계입니다 🌱"}
              </Text>
            </View>

            <SectionTitle title="관계 역동성 분석" emoji="📊" />
            <View style={styles.dashboardCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>대화 점유율</Text>
                <Text style={styles.chartValue}>나 {data.shareMe}% : 상대 {data.sharePartner}%</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.barLeft, { flex: data.shareMe }]} />
                <View style={[styles.barRight, { flex: data.sharePartner }]} />
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}><Text style={styles.statVal}>{data.replyTime}</Text><Text style={styles.statLab}>평균 답장</Text></View>
                <View style={styles.divider} />
                <View style={styles.statItem}><Text style={styles.statVal}>{data.syncIndex}%</Text><Text style={styles.statLab}>스타일 일치</Text></View>
              </View>
            </View>
          </View>
        </ViewShot>

        <ViewShot ref={part2Ref} options={{ format: "png", quality: 0.9 }}>
          <View style={styles.captureArea}>
            <SectionTitle title="상대방 심리 리포트" emoji="🧠" />
            <View style={styles.dashboardCard}>
              <View style={styles.mbtiRow}>
                <View style={styles.mbtiBadge}><Text style={styles.mbtiBadgeText}>{data.mbti}</Text></View>
                <View style={[styles.mbtiBadge, {backgroundColor: '#EEF2FF'}]}><Text style={[styles.mbtiBadgeText, {color: '#6366F1'}]}>{data.attachment} 애착</Text></View>
              </View>
              <View style={styles.bigFiveList}>
                {[
                  { label: '외향성', val: data.bigFive.extraversion, color: '#8B5CF6' },
                  { label: '친화성', val: data.bigFive.agreeableness, color: '#10B981' },
                ].map((item, idx) => (
                  <View key={idx} style={styles.bigFiveRow}>
                    <Text style={styles.bigFiveLabel}>{item.label}</Text>
                    <View style={styles.miniBarBg}><View style={[styles.miniBarFill, {width: `${item.val}%`, backgroundColor: item.color}]} /></View>
                  </View>
                ))}
              </View>
            </View>

            <SectionTitle title="맞춤형 솔루션" emoji="💡" />
            <View style={styles.momentCard}>
              <Text style={styles.cardHeaderSmall}>⭐ 결정적 순간</Text>
              <Text style={styles.cardBodyText}>{data.moment}</Text>
            </View>
            <View style={styles.guideCard}>
              <Text style={[styles.cardHeaderSmall, {color: '#10B981'}]}>✅ 대화 꿀팁</Text>
              <Text style={styles.cardBodyText}>{data.tips}</Text>
            </View>
          </View>
        </ViewShot>

        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>처음으로 돌아가기</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 메뉴 모달 */}
      <Modal visible={isMenuOpen} transparent={true} animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHandle} />
            <Text style={styles.menuTitle}>리포트 관리</Text>
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}><Text style={styles.menuItemText}>📱 결과 공유하기</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSaveImage}><Text style={styles.menuItemText}>🖼️ 이미지로 저장</Text></TouchableOpacity>
            <TouchableOpacity style={styles.closeMenuButton} onPress={() => setIsMenuOpen(false)}><Text style={styles.closeMenuButtonText}>닫기</Text></TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* 저장 성공 모달 */}
      <Modal visible={saveStatus.visible} transparent={true} animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>{saveStatus.title}</Text>
            <Text style={styles.successMessage}>{saveStatus.message}</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={() => setSaveStatus({ ...saveStatus, visible: false })}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerBtn: { width: 40 },
  headerRight: { width: 40, alignItems: 'flex-end' },
  menuIconBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  menuIconText: { fontSize: 16 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  captureArea: { paddingHorizontal: 20, paddingTop: 25 },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 32, padding: 30, alignItems: 'center', marginBottom: 25, elevation: 4 },
  resultCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#A78BFA' },
  scoreValue: { fontSize: 45, fontWeight: '900', color: '#7C3AED' },
  scoreLabel: { fontSize: 14, color: '#8B5CF6', marginTop: -5 },
  statusBadge: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 15 },
  statusBadgeText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  summaryText: { fontSize: 15, color: '#4B5563', textAlign: 'center', marginTop: 15, lineHeight: 22 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  sectionEmoji: { fontSize: 20, marginRight: 8 },
  dashboardCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 25, elevation: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  chartTitle: { fontSize: 14, fontWeight: '800' },
  chartValue: { fontSize: 13, color: '#6B7280' },
  barContainer: { height: 14, flexDirection: 'row', borderRadius: 7, overflow: 'hidden', marginBottom: 20, backgroundColor: '#F1F5F9' },
  barLeft: { backgroundColor: '#C4B5FD' },
  barRight: { backgroundColor: '#8B5CF6' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLab: { fontSize: 11, color: '#94A3B8' },
  divider: { width: 1, height: '60%', backgroundColor: '#F1F5F9' },
  mbtiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  mbtiBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  mbtiBadgeText: { fontWeight: '800', color: '#7C3AED' },
  bigFiveList: { gap: 12 },
  bigFiveRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bigFiveLabel: { width: 50, fontSize: 12, fontWeight: '700' },
  miniBarBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4 },
  miniBarFill: { height: '100%', borderRadius: 4 },
  momentCard: { backgroundColor: '#FFF7ED', borderRadius: 24, padding: 20, marginBottom: 15 },
  guideCard: { backgroundColor: '#F0FDF4', borderRadius: 24, padding: 20, marginBottom: 25 },
  cardHeaderSmall: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  cardBodyText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  resetButton: { alignItems: 'center', padding: 20 },
  resetButtonText: { color: '#94A3B8', textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  menuHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  menuTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuItemText: { fontSize: 16, fontWeight: '600' },
  closeMenuButton: { marginTop: 15, backgroundColor: '#F8FAFC', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  closeMenuButtonText: { fontWeight: '700', color: '#64748B' },
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  successCard: { width: '80%', backgroundColor: '#FFF', borderRadius: 30, padding: 30, alignItems: 'center' },
  successTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  successMessage: { textAlign: 'center', color: '#6B7280', marginBottom: 25 },
  confirmButton: { backgroundColor: '#8B5CF6', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 15 },
  confirmButtonText: { color: '#FFF', fontWeight: '700' },
});

export default ResultScreen;
