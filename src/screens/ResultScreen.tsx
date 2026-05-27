import React, { useRef } from 'react';
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
  ActivityIndicator,
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
  // 💡 리포트를 두 개로 나누어 안정적으로 캡처하기 위해 두 개의 ViewShot ref를 생성합니다.
  const part1Ref = useRef<ViewShot>(null);
  const part2Ref = useRef<ViewShot>(null);

  // 시연용 및 데이터 누락 방지용 기본 데이터
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

  const hasAndroidPermission = async () => {
    if (Platform.OS !== 'android') return true;
    if (Number(Platform.Version) >= 29) return true;
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  // 💡 안정성을 극대화한 이미지 저장 함수 (분할 캡처 + 순차 저장)
  const handleSaveImage = async () => {
    try {
      const hasPermission = await hasAndroidPermission();
      if (!hasPermission) {
        Alert.alert("권한 거부", "갤러리에 저장하기 위해 저장 권한이 필요합니다.");
        return;
      }

      if (!part1Ref.current || !part2Ref.current) {
        Alert.alert("오류", "캡처 영역을 준비하지 못했습니다.");
        return;
      }

      // 💡 사용자 요청 해결책 1: 저장 중 알림 표시
      Alert.alert("저장 시작", "리포트가 길어 두 장의 이미지로 나누어 생성하고 있습니다. 잠시만 기다려주세요...", []);

      // 💡 사용자 요청 해결책 2: 0.5초 대기 후 캡처 실행 (안드로이드 snapshot 에러 방지)
      setTimeout(async () => {
        try {
          // 💡 해결책 3: .capture() 메서드 직접 호출 및 순차 저장

          // 1. 리포트 상단 캡처 및 저장
          const uri1 = await part1Ref.current!.capture!();
          await CameraRoll.save(uri1, { type: 'photo', album: 'AI 채팅 분석' });

          // 2. 하단 캡처 진행 (시스템 부하 방지를 위해 짧은 지연 후 실행)
          setTimeout(async () => {
            try {
              const uri2 = await part2Ref.current!.capture!();
              await CameraRoll.save(uri2, { type: 'photo', album: 'AI 채팅 분석' });

              Alert.alert("저장 완료", "리포트 2장이 갤러리에 모두 저장되었습니다! ✨");
            } catch (err2) {
              console.error("Part 2 Capture Error:", err2);
              Alert.alert("저장 실패", "리포트 하단 이미지 변환에 실패했습니다.");
            }
          }, 400);

        } catch (err1) {
          console.error("Part 1 Capture Error:", err1);
          Alert.alert("저장 실패", "리포트 상단 이미지 변환에 실패했습니다. (메모리 부족)");
        }
      }, 500);

    } catch (error) {
      console.error("Save process error:", error);
      Alert.alert("저장 실패", "이미지를 저장하는 중 오류가 발생했습니다.");
    }
  };

  const SectionTitle = ({ title, emoji }: { title: string; emoji: string }) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onReset} style={styles.headerBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 채팅 정밀 진단서</Text>
        <View style={styles.headerRight}><Text style={styles.dotsIcon}>●●●</Text></View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 💡 PART 1: 상단 리포트 (호감도, 대화패턴) */}
        <ViewShot
          ref={part1Ref}
          options={{ format: "png", quality: 0.9 }}
          style={{ backgroundColor: '#F8F9FE' }}
        >
          <View style={styles.captureArea} collapsable={false}>
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
                <View style={[styles.barLeft, { flex: data.shareMe || 1 }]} />
                <View style={[styles.barRight, { flex: data.sharePartner || 1 }]} />
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{data.replyTime}</Text>
                  <Text style={styles.statLab}>평균 답장</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{data.syncIndex}%</Text>
                  <Text style={styles.statLab}>스타일 일치</Text>
                </View>
              </View>
            </View>
          </View>
        </ViewShot>

        {/* 💡 PART 2: 하단 리포트 (심리 분석, 솔루션 가이드) */}
        <ViewShot
          ref={part2Ref}
          options={{ format: "png", quality: 0.9 }}
          style={{ backgroundColor: '#F8F9FE' }}
        >
          <View style={[styles.captureArea, { paddingTop: 0 }]} collapsable={false}>
            <SectionTitle title="상대방 심리 리포트" emoji="🧠" />
            <View style={styles.dashboardCard}>
              <View style={styles.mbtiRow}>
                <View style={styles.mbtiBadge}><Text style={styles.mbtiBadgeText}>{data.mbti}</Text></View>
                <View style={[styles.mbtiBadge, {backgroundColor: '#EEF2FF'}]}><Text style={[styles.mbtiBadgeText, {color: '#6366F1'}]}>{data.attachment} 애착</Text></View>
              </View>
              <Text style={styles.chartSubTitle}>Big Five 성격 수치 분석</Text>
              <View style={styles.bigFiveList}>
                {[
                  { label: '외향성', val: data.bigFive.extraversion, color: '#8B5CF6' },
                  { label: '친화성', val: data.bigFive.agreeableness, color: '#10B981' },
                  { label: '개방성', val: data.bigFive.openness, color: '#F59E0B' },
                ].map((item, idx) => (
                  <View key={idx} style={styles.bigFiveRow}>
                    <Text style={styles.bigFiveLabel}>{item.label}</Text>
                    <View style={styles.miniBarBg}><View style={[styles.miniBarFill, {width: `${item.val}%`, backgroundColor: item.color}]} /></View>
                    <Text style={styles.bigFiveVal}>{item.val}%</Text>
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
              <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 }} />
              <Text style={[styles.cardHeaderSmall, {color: '#EF4444'}]}>⚠️ 주의해야 할 점</Text>
              <Text style={styles.cardBodyText}>{data.warning}</Text>
            </View>
          </View>
        </ViewShot>

        {/* 하단 제어 버튼 영역 */}
        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>리포트 이미지로 저장하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>처음으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', zIndex: 100 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  dotsIcon: { fontSize: 12, color: '#D1D5DB' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  captureArea: { paddingHorizontal: 20, paddingTop: 25, backgroundColor: '#F8F9FE' },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 32, padding: 30, alignItems: 'center', marginBottom: 25, elevation: 8, shadowColor: '#8B5CF6', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } },
  resultCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#A78BFA', marginBottom: 20 },
  scoreValue: { fontSize: 45, fontWeight: '900', color: '#7C3AED' },
  scoreLabel: { fontSize: 14, color: '#8B5CF6', fontWeight: '700', marginTop: -5 },
  statusBadge: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 20 },
  statusBadgeText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  summaryText: { fontSize: 15, fontWeight: '600', color: '#4B5563', textAlign: 'center', marginTop: 15, lineHeight: 22 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10, paddingHorizontal: 5 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#1F2937' },
  sectionEmoji: { fontSize: 22, marginRight: 10 },
  dashboardCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 25, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  chartTitle: { fontSize: 14, fontWeight: '800', color: '#1F2937' },
  chartValue: { fontSize: 13, color: '#6B7280' },
  barContainer: { height: 14, flexDirection: 'row', borderRadius: 7, overflow: 'hidden', marginBottom: 20, backgroundColor: '#F1F5F9' },
  barLeft: { backgroundColor: '#C4B5FD' },
  barRight: { backgroundColor: '#8B5CF6' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  statLab: { fontSize: 11, color: '#94A3B8', marginTop: 3 },
  divider: { width: 1, height: 30, backgroundColor: '#F1F5F9' },
  mbtiRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  mbtiBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  mbtiBadgeText: { fontSize: 15, fontWeight: '900', color: '#7C3AED' },
  chartSubTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 15 },
  bigFiveList: { gap: 12 },
  bigFiveRow: { flexDirection: 'row', alignItems: 'center' },
  bigFiveLabel: { width: 50, fontSize: 12, fontWeight: '700', color: '#4B5563' },
  miniBarBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, marginHorizontal: 10, overflow: 'hidden' },
  miniBarFill: { height: '100%', backgroundColor: '#8B5CF6' },
  bigFiveVal: { width: 35, fontSize: 12, fontWeight: '800', color: '#1F2937', textAlign: 'right' },
  momentCard: { backgroundColor: '#EEF2FF', padding: 20, borderRadius: 20, borderLeftWidth: 5, borderLeftColor: '#6366F1', marginBottom: 15 },
  cardHeaderSmall: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  cardBodyText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  horizontalLine: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 },
  bottomArea: { paddingHorizontal: 20, marginTop: 10 },
  saveButton: { backgroundColor: '#7C3AED', paddingVertical: 20, borderRadius: 20, alignItems: 'center', marginBottom: 12, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  resetButton: { alignItems: 'center', padding: 10 },
  resetButtonText: { color: '#94A3B8', textDecorationLine: 'underline' },
  guideCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 25 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE' },
  loadingText: { marginTop: 15, color: '#8B5CF6', fontWeight: '700' },
});

export default ResultScreen;
