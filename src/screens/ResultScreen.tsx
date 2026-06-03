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
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { AnalysisData } from '../types/Analysis';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  resultData: AnalysisData | null;
  onReset: () => void;
  isDarkMode: boolean;
  onMyPagePress: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  resultData,
  onReset,
  isDarkMode,
  onMyPagePress,
}) => {
  const part1Ref = useRef<ViewShot>(null);
  const part2Ref = useRef<ViewShot>(null);

  const [customModal, setCustomModal] = useState({
    visible: false,
    title: '',
    message: '',
    icon: '!',
  });

  const fallbackData: AnalysisData = {
    resultScore: 95,
    shareMe: 45,
    sharePartner: 55,
    replyTime: '12분',
    syncIndex: 88,
    keywords: ['오늘뭐해', '보고싶다', '웃겨', '카페', '내일'],
    mbti: 'ENFP',
    attachment: '안정형',
    bigFive: {
      openness: 90,
      conscientiousness: 60,
      extraversion: 80,
      agreeableness: 85,
      neuroticism: 30,
    },
    moment:
      '내일 우리 같이 영화 볼래? 라고 물었을 때 상대방의 호감도가 급상승했습니다.',
    tips: "상대방의 관심사인 '여행' 주제를 더 깊게 파보세요.",
    warning: '단답형 대답은 상대방을 위축되게 할 수 있습니다.',
  };

  const data = resultData || fallbackData;

  const questionPool = [
    '최근에 가장 즐거웠던 일이 뭐야?',
    '요즘 가장 빠져있는 취미가 있어?',
    '가보고 싶은 여행지는 어디야?',
    '주말에는 주로 어떻게 보내?',
    '어릴 때 꿈이 뭐였어?',
    '요즘 가장 기대되는 일이 있어?',
    '최근에 본 영화 중 가장 재밌었던 건?',
    '스트레스 받을 때는 어떻게 풀어?',
    '가장 좋아하는 음식은 뭐야?',
    '어릴 때 가장 기억에 남는 추억은?',
    '가장 가고 싶은 나라는 어디야?',
    '최근에 새로 시작한 게 있어?',
    '이상형은 어떤 사람이야?',
    '가장 좋아하는 계절은 언제야?',
    '요즘 듣는 노래 추천해줄 수 있어?',
  ];

  const getRandomQuestions = () => {
    return [...questionPool].sort(() => Math.random() - 0.5).slice(0, 5);
  };

  const [recommendedQuestions, setRecommendedQuestions] =
    useState(getRandomQuestions());

  const refreshQuestions = () => {
    setRecommendedQuestions(getRandomQuestions());
  };

  const showModal = (title: string, message: string, icon: string = '!') => {
    setCustomModal({
      visible: true,
      title,
      message,
      icon,
    });
  };

  const closeModal = () => {
    setCustomModal(prev => ({ ...prev, visible: false }));
  };

  const theme = {
    background: isDarkMode ? '#0F172A' : '#F6F5FF',
    header: isDarkMode ? '#1E293B' : '#FFFFFF',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E1B4B',
    subText: isDarkMode ? '#CBD5E1' : '#475569',
    lightText: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#EEECFF',
    capture: isDarkMode ? '#0F172A' : '#F6F5FF',
    miniBg: isDarkMode ? '#334155' : '#F1EFFF',
    purpleBox: isDarkMode ? '#1E1B4B' : '#F4F0FF',
    badgeBg: isDarkMode ? '#334155' : '#F3F0FF',
  };

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
        showModal('권한 거부', '갤러리에 저장하기 위해\n저장 권한이 필요합니다.', '!');
        return;
      }

      if (!part1Ref.current || !part2Ref.current) {
        showModal('오류', '캡처 영역을\n준비하지 못했습니다.', '!');
        return;
      }

      showModal(
        '저장 시작',
        '리포트가 길어 두 장의 이미지로\n나누어 생성하고 있습니다.\n잠시만 기다려주세요...',
        '⏳',
      );

      setTimeout(async () => {
        try {
          const uri1 = await part1Ref.current!.capture!();
          await CameraRoll.save(uri1, {
            type: 'photo',
            album: 'AI 채팅 분석',
          });

          setTimeout(async () => {
            try {
              const uri2 = await part2Ref.current!.capture!();
              await CameraRoll.save(uri2, {
                type: 'photo',
                album: 'AI 채팅 분석',
              });

              showModal('저장 완료', '리포트 2장이 갤러리에\n모두 저장되었습니다! 🩷', '✓');
            } catch (err2) {
              console.error('Part 2 Capture Error:', err2);
              showModal('저장 실패', '리포트 하단 이미지 변환에\n실패했습니다.', '!');
            }
          }, 400);
        } catch (err1) {
          console.error('Part 1 Capture Error:', err1);
          showModal(
            '저장 실패',
            '리포트 상단 이미지 변환에\n실패했습니다. (메모리 부족)',
            '!',
          );
        }
      }, 500);
    } catch (error) {
      console.error('Save process error:', error);
      showModal('저장 실패', '이미지를 저장하는 중\n오류가 발생했습니다.', '!');
    }
  };

  const SectionTitle = ({ title, emoji }: { title: string; emoji: string }) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.header,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onReset}
          style={styles.headerBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          AI 채팅 정밀 진단서
        </Text>

        <TouchableOpacity
          style={styles.headerRight}
          onPress={onMyPagePress}
          activeOpacity={0.7}
        >
          <Text style={styles.myPageIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={part1Ref}
          options={{ format: 'png', quality: 0.9 }}
          style={{ backgroundColor: theme.capture }}
        >
          <View
            style={[styles.captureArea, { backgroundColor: theme.capture }]}
            collapsable={false}
          >
            <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
              <View
                style={[
                  styles.resultCircle,
                  {
                    backgroundColor: theme.badgeBg,
                    borderColor: isDarkMode ? '#475569' : '#E2D9FF',
                  },
                ]}
              >
                <Text style={styles.scoreValue}>{data.resultScore}%</Text>
                <Text style={styles.scoreLabel}>호감 지수</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {data.resultScore > 80
                    ? '🩷 완벽한 싱크로율'
                    : data.resultScore > 50
                      ? '🌸 긍정적 시그널'
                      : '🌱 탐색 중'}
                </Text>
              </View>

              <Text style={[styles.summaryText, { color: theme.subText }]}>
                {data.resultScore > 80
                  ? '서로에게 깊이 빠져있는 상태입니다.\n환상적인 대화를 이어가고 있네요!'
                  : data.resultScore > 50
                    ? '긍정적인 기류가 부드럽게 흐르고 있어요.\n조금만 더 용기 내어 다가가 보세요!'
                    : '아직은 서로 알아가는 단답의 해독이 필요한 단계입니다 🌱'}
              </Text>
            </View>

            <SectionTitle title="관계 역동성 분석" emoji="📊" />

            <View style={[styles.dashboardCard, { backgroundColor: theme.card }]}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>
                  대화 점유율 비율
                </Text>
                <Text style={[styles.chartValue, { color: '#A78BFA' }]}>
                  나 {data.shareMe}% : 상대 {data.sharePartner}%
                </Text>
              </View>

              <View style={[styles.barContainer, { backgroundColor: theme.miniBg }]}>
                <View style={[styles.barLeft, { flex: data.shareMe || 1 }]} />
                <View style={[styles.barRight, { flex: data.sharePartner || 1 }]} />
              </View>

              <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: theme.text }]}>
                    {data.replyTime}
                  </Text>
                  <Text style={[styles.statLab, { color: theme.lightText }]}>
                    평균 답장 속도
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: theme.text }]}>
                    {data.syncIndex}%
                  </Text>
                  <Text style={[styles.statLab, { color: theme.lightText }]}>
                    대화체 일치도
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ViewShot>

        <ViewShot
          ref={part2Ref}
          options={{ format: 'png', quality: 0.9 }}
          style={{ backgroundColor: theme.capture }}
        >
          <View
            style={[
              styles.captureArea,
              { paddingTop: 0, backgroundColor: theme.capture },
            ]}
            collapsable={false}
          >
            <SectionTitle title="상대방 심리 리포트" emoji="🧠" />

            <View style={[styles.dashboardCard, { backgroundColor: theme.card }]}>
              <View style={styles.mbtiRow}>
                <View style={[styles.mbtiBadge, { backgroundColor: theme.badgeBg }]}>
                  <Text style={styles.mbtiBadgeText}>{data.mbti} 성향</Text>
                </View>

                <View
                  style={[
                    styles.mbtiBadge,
                    { backgroundColor: isDarkMode ? '#1E1B4B' : '#F3F0FF' },
                  ]}
                >
                  <Text
                    style={[
                      styles.mbtiBadgeText,
                      { color: isDarkMode ? '#C4B5FD' : '#A78BFA' },
                    ]}
                  >
                    {data.attachment} 애착 유형
                  </Text>
                </View>
              </View>

              <Text style={[styles.chartSubTitle, { color: theme.lightText }]}>
                성격 입체 분석 수치
              </Text>

              <View style={styles.bigFiveList}>
                {[
                  { label: '외향성', val: data.bigFive.extraversion, color: '#C4B5FD' },
                  { label: '친화성', val: data.bigFive.agreeableness, color: '#DDD6FE' },
                  { label: '개방성', val: data.bigFive.openness, color: '#EAE6FF' },
                ].map((item, idx) => (
                  <View key={idx} style={styles.bigFiveRow}>
                    <Text style={[styles.bigFiveLabel, { color: theme.subText }]}>
                      {item.label}
                    </Text>

                    <View style={[styles.miniBarBg, { backgroundColor: theme.miniBg }]}>
                      <View
                        style={[
                          styles.miniBarFill,
                          {
                            width: `${item.val}%`,
                            backgroundColor: item.color,
                          },
                        ]}
                      />
                    </View>

                    <Text style={[styles.bigFiveVal, { color: theme.text }]}>
                      {item.val}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <SectionTitle title="맞춤형 솔루션" emoji="💡" />

            <View style={[styles.momentCard, { backgroundColor: theme.purpleBox }]}>
              <Text
                style={[
                  styles.cardHeaderSmall,
                  { color: isDarkMode ? '#C4B5FD' : '#A78BFA' },
                ]}
              >
                ⭐ 결정적 순간 캐치
              </Text>
              <Text style={[styles.cardBodyText, { color: theme.subText }]}>
                {data.moment}
              </Text>
            </View>

            <View style={[styles.guideCard, { backgroundColor: theme.card }]}>
              <View style={[styles.questionCard, { backgroundColor: theme.card }]}>
                <View style={styles.questionHeader}>
                  <Text style={[styles.cardHeaderSmall, { color: '#8B5CF6' }]}>
                    💬 추천 질문 리스트
                  </Text>

                  <TouchableOpacity
                    onPress={refreshQuestions}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.refreshText}>🔄 새로고침</Text>
                  </TouchableOpacity>
                </View>

                {recommendedQuestions.map((question, index) => (
                  <View key={index} style={styles.questionItem}>
                    <Text style={styles.questionNumber}>{index + 1}</Text>

                    <Text style={[styles.questionText, { color: theme.subText }]}>
                      {question}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.cardHeaderSmall, { color: '#10B981' }]}>
                ✅ 대화 핵심 리드 꿀팁
              </Text>

              <Text style={[styles.cardBodyText, { color: theme.subText }]}>
                {data.tips}
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: theme.border,
                  marginVertical: 16,
                }}
              />

              <Text style={[styles.cardHeaderSmall, { color: '#EF4444' }]}>
                ⚠️ 대화 시 주의해야 할 시그널
              </Text>

              <Text style={[styles.cardBodyText, { color: theme.subText }]}>
                {data.warning}
              </Text>
            </View>
          </View>
        </ViewShot>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveImage}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>리포트 이미지로 저장하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={[styles.resetButtonText, { color: theme.lightText }]}>
              처음으로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={customModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.customModalCard,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <View style={styles.customModalIconCircle}>
              <Text style={styles.customModalIcon}>{customModal.icon}</Text>
            </View>

            <Text style={[styles.customModalTitle, { color: theme.text }]}>
              {customModal.title}
            </Text>

            <Text style={[styles.customModalMessage, { color: theme.subText }]}>
              {customModal.message}
            </Text>

            <TouchableOpacity
              style={styles.customModalButton}
              onPress={closeModal}
              activeOpacity={0.85}
            >
              <Text style={styles.customModalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderBottomWidth: 1.5,
    zIndex: 100,
  },
  headerTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4 },
  backIcon: { fontSize: 38, color: '#C4B5FD', marginTop: -4 },
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myPageIcon: {
    fontSize: 22,
    color: '#A78BFA',
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  captureArea: { paddingHorizontal: 22, paddingTop: 24 },
  summaryCard: {
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#C4B5FD',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  resultCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 46,
    fontWeight: '900',
    color: '#A78BFA',
    letterSpacing: -0.5,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#C4B5FD',
    fontWeight: '800',
    marginTop: -4,
    letterSpacing: -0.1,
  },
  statusBadge: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 24,
    marginTop: 16,
  },
  statusBadgeText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13.5,
    letterSpacing: -0.2,
  },
  summaryText: {
    fontSize: 14.5,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 18.5, fontWeight: '800', letterSpacing: -0.4 },
  sectionEmoji: { fontSize: 20, marginRight: 8 },
  dashboardCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#C4B5FD',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  chartValue: { fontSize: 13.5, fontWeight: '700', letterSpacing: -0.1 },
  barContainer: {
    height: 14,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  barLeft: { backgroundColor: '#E2D9FF' },
  barRight: { backgroundColor: '#A78BFA' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  statLab: {
    fontSize: 11,
    marginTop: 5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  divider: { width: 1.5, height: 32 },
  mbtiRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  mbtiBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
  },
  mbtiBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#A78BFA',
    letterSpacing: -0.1,
  },
  chartSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  bigFiveList: { gap: 14 },
  bigFiveRow: { flexDirection: 'row', alignItems: 'center' },
  bigFiveLabel: {
    width: 52,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  miniBarBg: {
    flex: 1,
    height: 9,
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  miniBarFill: { height: '100%', borderRadius: 6 },
  bigFiveVal: {
    width: 38,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  momentCard: {
    padding: 20,
    borderRadius: 22,
    borderLeftWidth: 6,
    borderLeftColor: '#C4B5FD',
    marginBottom: 16,
  },
  cardHeaderSmall: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  cardBodyText: { fontSize: 13.5, lineHeight: 22, letterSpacing: -0.2 },
  bottomArea: { paddingHorizontal: 22, marginTop: 16 },
  saveButton: {
    backgroundColor: '#A78BFA',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 6,
    shadowColor: '#A78BFA',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  resetButton: { alignItems: 'center', padding: 12 },
  resetButtonText: {
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '600',
  },
  guideCard: {
    padding: 22,
    borderRadius: 22,
    elevation: 4,
    shadowColor: '#C4B5FD',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    marginBottom: 26,
  },
  questionCard: {
    padding: 22,
    borderRadius: 22,
    marginBottom: 26,
    elevation: 4,
    shadowColor: '#C4B5FD',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  refreshText: {
    color: '#A78BFA',
    fontWeight: '800',
    fontSize: 13,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EDE9FE',
    textAlign: 'center',
    lineHeight: 28,
    color: '#7C3AED',
    fontWeight: '800',
    marginRight: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 75, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  customModalCard: {
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#C4B5FD',
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  customModalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  customModalIcon: {
    fontSize: 30,
    color: '#A78BFA',
    fontWeight: '900',
  },
  customModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  customModalMessage: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  customModalButton: {
    width: '100%',
    backgroundColor: '#A78BFA',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },
  customModalButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
  },
});

export default ResultScreen;