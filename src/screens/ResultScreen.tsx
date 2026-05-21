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
} from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { AnalysisData } from '../types/Analysis';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  resultData: AnalysisData | null;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultData, onReset }) => {
  const viewShotRef = useRef<ViewShot>(null);

  // 시연용 더미 데이터
  const fallbackData: AnalysisData = {
    resultScore: 95,
    shareMe: 45,
    sharePartner: 55,
    replyTime: "12분",
    syncIndex: 88,
    keywords: ["오늘뭐해", "보고싶다", "웃겨", "카페", "내일"],
    mbti: "ENFP",
    attachment: "안정형",
    bigFive: {
      openness: 90,
      conscientiousness: 60,
      extraversion: 80,
      agreeableness: 85,
      neuroticism: 30
    },
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

  const handleSaveImage = async () => {
    try {
      const hasPermission = await hasAndroidPermission();
      if (!hasPermission) {
        Alert.alert("권한 거부", "갤러리에 저장하기 위해 저장 권한이 필요합니다.");
        return;
      }
      if (!viewShotRef.current) {
        Alert.alert("오류", "캡처 영역을 찾을 수 없습니다.");
        return;
      }

      // 💡 해결책 1: 사용자에게 저장 중임을 알리는 팝업을 먼저 띄웁니다.
      Alert.alert("저장 중", "정밀 분석 리포트 이미지를 생성하고 있습니다...", []);

      // 💡 해결책 2: setTimeout을 주어 UI가 완벽히 렌더링된 후 캡처하도록 0.2초 대기 시간을 줍니다.
      setTimeout(async () => {
        try {
          // 💡 해결책 3: 에러를 유발할 수 있는 'result: "tmpfile"' 옵션을 제거하고 가장 안정적인 옵션만 남깁니다.
          const uri = await captureRef(viewShotRef, {
            format: "png",
            quality: 0.9, // 용량과 화질의 최적 균형
          });

          console.log("캡처 성공 URI:", uri);

          // CameraRoll 저장 실행
          await CameraRoll.save(uri, { type: 'photo', album: 'AI 채팅 분석' });

          // 기존 '저장 중' 알림을 덮어쓰고 완료 알림 띄우기
          Alert.alert("저장 완료", "갤러리에 정밀 분석 리포트가 저장되었습니다! ✨");
        } catch (captureError) {
          console.error("Timeout 내부 캡처 에러:", captureError);
          Alert.alert("저장 실패", "화면을 이미지로 변환하는 데 실패했습니다. 다시 시도해 주세요.");
        }
      }, 200); // 200ms 지연

    } catch (error) {
      console.error("Capture error:", error);
      Alert.alert("저장 실패", "이미지를 저장하는 중 오류가 발생했습니다. 권한 설정을 확인해 주세요.");
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
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }} style={{ backgroundColor: '#F8F9FE' }}>
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
              <View style={styles.keywordList}>
                {data.keywords?.map((word, i) => (
                  <View key={i} style={styles.keywordChip}>
                    <Text style={styles.keywordText}>#{word}</Text>
                  </View>
                ))}
              </View>
            </View>

            <SectionTitle title="상대방 심리 리포트" emoji="🧠" />
            <View style={styles.dashboardCard}>
              <View style={styles.mbtiRow}>
                <View style={styles.mbtiBadge}><Text style={styles.mbtiBadgeText}>{data.mbti}</Text></View>
                <View style={[styles.mbtiBadge, {backgroundColor: '#EEF2FF'}]}><Text style={[styles.mbtiBadgeText, {color: '#6366F1'}]}>{data.attachment} 애착</Text></View>
              </View>
              <Text style={styles.chartSubTitle}>Big Five 성격 수치 분석</Text>
              <View style={styles.bigFiveList}>
                <View style={styles.bigFiveRow}>
                  <Text style={styles.bigFiveLabel}>외향성</Text>
                  <View style={styles.miniBarBg}><View style={[styles.miniBarFill, {width: `${data.bigFive.extraversion}%`}]} /></View>
                  <Text style={styles.bigFiveVal}>{data.bigFive.extraversion}%</Text>
                </View>
                <View style={styles.bigFiveRow}>
                  <Text style={styles.bigFiveLabel}>친화성</Text>
                  <View style={styles.miniBarBg}><View style={[styles.miniBarFill, {width: `${data.bigFive.agreeableness}%`, backgroundColor: '#10B981'}]} /></View>
                  <Text style={styles.bigFiveVal}>{data.bigFive.agreeableness}%</Text>
                </View>
                <View style={styles.bigFiveRow}>
                  <Text style={styles.bigFiveLabel}>개방성</Text>
                  <View style={styles.miniBarBg}><View style={[styles.miniBarFill, {width: `${data.bigFive.openness}%`, backgroundColor: '#F59E0B'}]} /></View>
                  <Text style={styles.bigFiveVal}>{data.bigFive.openness}%</Text>
                </View>
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
              <View style={styles.horizontalLine} />
              <Text style={[styles.cardHeaderSmall, {color: '#EF4444'}]}>⚠️ 주의해야 할 점</Text>
              <Text style={styles.cardBodyText}>{data.warning}</Text>
            </View>
          </View>
        </ViewShot>

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
  resultCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#A78BFA' },
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
  keywordList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, justifyContent: 'center' },
  keywordChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, margin: 4 },
  keywordText: { fontSize: 13, color: '#4B5563', fontWeight: '700' },
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
  resetButtonText: { color: '#94A3B8', textDecorationLine: 'underline' }
});

export default ResultScreen;
