import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AiAvoidMessage,
  AiConversationEvidence,
  AiNextAction,
  AnalysisData,
} from '../types/Analysis';

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
  const theme = {
    background: isDarkMode ? '#0F172A' : '#F6F5FF',
    header: isDarkMode ? '#1E293B' : '#FFFFFF',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E1B4B',
    subText: isDarkMode ? '#CBD5E1' : '#475569',
    border: isDarkMode ? '#334155' : '#EEECFF',
    badgeBg: isDarkMode ? '#334155' : '#F3F0FF',
  };

  if (!resultData) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>표시할 분석 결과가 없습니다.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onReset}>
          <Text style={styles.primaryButtonText}>처음으로</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const data = resultData;
  const ai = data.aiDeepAnalysis;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onReset} style={styles.headerButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>분석 결과</Text>
        <TouchableOpacity onPress={onMyPagePress} style={styles.headerButton}>
          <Text style={styles.myText}>MY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.scoreCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.reportTitle, { color: theme.text }]}>{data.title || '대화 분석 리포트'}</Text>
          <Text style={[styles.reportDate, { color: theme.subText }]}>{data.date}</Text>
          <View style={[styles.scoreCircle, { backgroundColor: theme.badgeBg, borderColor: '#A78BFA' }]}>
            <Text style={styles.scoreValue}>{data.resultScore}%</Text>
            <Text style={styles.scoreLabel}>관계 지수</Text>
          </View>
          <Text style={[styles.summaryText, { color: theme.subText }]}>
            {ai?.oneLineSummary || data.analysisSummary || defaultSummary(data.resultScore)}
          </Text>
        </View>

        {ai && (
          <Section title="AI 핵심 판단" theme={theme}>
            <View style={styles.verdictGrid}>
              <MiniCard label="결론" value={ai.verdict} />
              <MiniCard label="확신도" value={`${ai.confidence}%`} />
              <MiniCard label="관계 단계" value={ai.relationshipStage} wide />
            </View>
          </Section>
        )}

        {ai && (
          <Section title="실제 대화 기반 호감 신호" theme={theme}>
            <EvidenceList items={ai.positiveSignals} positive />
          </Section>
        )}

        {ai && (
          <Section title="실제 대화 기반 위험 신호" theme={theme}>
            <EvidenceList items={ai.riskSignals} />
          </Section>
        )}

        <Section title="판단 근거" theme={theme}>
          <BulletList items={data.evidence || []} fallback="분석 근거를 정리하는 중입니다." />
        </Section>

        <Section title="대화 흐름" theme={theme}>
          <Metric label="내 대화 비율" value={`${data.shareMe}%`} />
          <Metric label="상대 대화 비율" value={`${data.sharePartner}%`} />
          <Metric label="평균 답장 속도" value={data.replyTime} />
          <Metric label="대화 싱크" value={`${data.syncIndex}%`} />
        </Section>

        <Section title="키워드" theme={theme}>
          <View style={styles.keywordWrap}>
            {data.keywords.map(keyword => (
              <View key={keyword} style={styles.keywordBadge}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="상대 성향" theme={theme}>
          <Metric label="MBTI 경향" value={data.mbti} />
          <Metric label="애착 유형" value={data.attachment} />
          <Metric label="외향성" value={`${data.bigFive.extraversion}%`} />
          <Metric label="친화성" value={`${data.bigFive.agreeableness}%`} />
          <Metric label="개방성" value={`${data.bigFive.openness}%`} />
          {!!ai?.counterpartyStyle && <Text style={[styles.bodyText, styles.topGap]}>{ai.counterpartyStyle}</Text>}
        </Section>

        {!!ai?.userPattern && (
          <Section title="내 대화 패턴" theme={theme}>
            <Text style={styles.bodyText}>{ai.userPattern}</Text>
          </Section>
        )}

        <Section title="결정적 순간" theme={theme}>
          <Text style={styles.bodyText}>{data.moment}</Text>
        </Section>

        <Section title="추천 행동" theme={theme}>
          <Text style={styles.bodyText}>{data.tips}</Text>
        </Section>

        {ai && (
          <Section title="바로 보낼 수 있는 멘트" theme={theme}>
            <ActionList items={ai.nextActions} />
          </Section>
        )}

        {ai && (
          <Section title="피해야 할 멘트" theme={theme}>
            <AvoidList items={ai.avoidMessages} />
          </Section>
        )}

        <Section title="다음에 보내기 좋은 질문" theme={theme}>
          <BulletList
            items={data.recommendedQuestions || []}
            fallback="상대가 부담 없이 답할 수 있는 가벼운 질문부터 이어가 보세요."
          />
        </Section>

        <Section title="추천 답장 예시" theme={theme}>
          <BulletList
            items={data.recommendedReplies || []}
            fallback="상대의 최근 관심사에 맞춰 짧고 자연스럽게 답장해 보세요."
          />
        </Section>

        <Section title="주의할 점" theme={theme}>
          <BulletList items={data.riskSignals || [data.warning]} fallback={data.warning} danger />
        </Section>

        {!!data.description && (
          <Section title="요청 내용" theme={theme}>
            <Text style={styles.bodyText}>{data.description}</Text>
          </Section>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={onReset}>
          <Text style={styles.primaryButtonText}>처음으로 돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const defaultSummary = (score: number) => {
  if (score >= 80) {
    return '대화 흐름이 긍정적입니다. 관심 신호와 상호작용이 비교적 잘 나타납니다.';
  }
  if (score >= 50) {
    return '긍정적인 요소가 있지만 관계 확신에는 추가 대화가 필요합니다.';
  }
  return '아직은 신중하게 접근하는 편이 좋습니다.';
};

const Section = ({
  title,
  theme,
  children,
}: {
  title: string;
  theme: { card: string; text: string; border: string };
  children: React.ReactNode;
}) => (
  <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    {children}
  </View>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const MiniCard = ({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) => (
  <View style={[styles.miniCard, wide && styles.miniCardWide]}>
    <Text style={styles.miniLabel}>{label}</Text>
    <Text style={styles.miniValue}>{value}</Text>
  </View>
);

const EvidenceList = ({ items, positive = false }: { items: AiConversationEvidence[]; positive?: boolean }) => {
  if (!items || items.length === 0) {
    return <Text style={styles.bodyText}>실제 대화 예시 기반 근거가 충분하지 않습니다.</Text>;
  }

  return (
    <View style={styles.cardList}>
      {items.map((item, index) => (
        <View key={`${item.label}_${index}`} style={styles.evidenceCard}>
          <View style={styles.evidenceHeader}>
            <Text style={[styles.evidenceLabel, positive ? styles.positiveText : styles.dangerText]}>
              {item.label}
            </Text>
            <Text style={styles.strengthText}>{item.strength}%</Text>
          </View>
          {!!item.quote && <Text style={styles.quoteText}>“{item.quote}”</Text>}
          <Text style={styles.bodyText}>{item.reason}</Text>
        </View>
      ))}
    </View>
  );
};

const ActionList = ({ items }: { items: AiNextAction[] }) => {
  if (!items || items.length === 0) {
    return <Text style={styles.bodyText}>가볍게 이어갈 수 있는 질문부터 시작해 보세요.</Text>;
  }

  return (
    <View style={styles.cardList}>
      {items.map((item, index) => (
        <View key={`${item.title}_${index}`} style={styles.evidenceCard}>
          <Text style={styles.evidenceLabel}>{item.title}</Text>
          <Text style={styles.messageText}>“{item.message}”</Text>
          <Text style={styles.bodyText}>{item.why}</Text>
        </View>
      ))}
    </View>
  );
};

const AvoidList = ({ items }: { items: AiAvoidMessage[] }) => {
  if (!items || items.length === 0) {
    return <Text style={styles.bodyText}>직접적인 확인 질문은 조금 더 관계가 무르익은 뒤가 좋습니다.</Text>;
  }

  return (
    <View style={styles.cardList}>
      {items.map((item, index) => (
        <View key={`${item.message}_${index}`} style={styles.evidenceCard}>
          <Text style={styles.dangerText}>피하기</Text>
          <Text style={styles.messageText}>“{item.message}”</Text>
          <Text style={styles.bodyText}>{item.why}</Text>
        </View>
      ))}
    </View>
  );
};

const BulletList = ({
  items,
  fallback,
  danger = false,
}: {
  items: string[];
  fallback: string;
  danger?: boolean;
}) => {
  const visibleItems = items.filter(Boolean);
  if (visibleItems.length === 0) {
    return <Text style={styles.bodyText}>{fallback}</Text>;
  }

  return (
    <View style={styles.bulletList}>
      {visibleItems.map((item, index) => (
        <View key={`${item}_${index}`} style={styles.bulletRow}>
          <Text style={[styles.bulletMark, danger && styles.dangerText]}>•</Text>
          <Text style={[styles.bulletText, danger && styles.dangerText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  headerButton: { width: 44, alignItems: 'center' },
  backText: { fontSize: 42, color: '#8B5CF6', lineHeight: 42 },
  myText: { color: '#8B5CF6', fontSize: 14, fontWeight: '900' },
  headerTitle: { fontSize: 17, fontWeight: '900' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  scoreCard: {
    width: Math.min(width - 40, 440),
    alignSelf: 'center',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
  },
  reportTitle: { fontSize: 20, fontWeight: '900', textAlign: 'center' },
  reportDate: { fontSize: 13, fontWeight: '600', marginTop: 6, marginBottom: 18 },
  scoreCircle: {
    width: 138,
    height: 138,
    borderRadius: 69,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    marginBottom: 16,
  },
  scoreValue: { color: '#8B5CF6', fontSize: 42, fontWeight: '900' },
  scoreLabel: { color: '#A78BFA', fontSize: 13, fontWeight: '900' },
  summaryText: { fontSize: 14, lineHeight: 21, textAlign: 'center', fontWeight: '600' },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: 12 },
  verdictGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniCard: {
    flex: 1,
    minWidth: 120,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    padding: 13,
  },
  miniCardWide: { flexBasis: '100%' },
  miniLabel: { color: '#7C3AED', fontSize: 12, fontWeight: '900', marginBottom: 6 },
  miniValue: { color: '#1E1B4B', fontSize: 15, fontWeight: '900', lineHeight: 20 },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: { color: '#64748B', fontSize: 14, fontWeight: '700' },
  metricValue: { color: '#8B5CF6', fontSize: 15, fontWeight: '900' },
  keywordWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  keywordBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  keywordText: { color: '#6D28D9', fontSize: 13, fontWeight: '800' },
  bodyText: { color: '#64748B', fontSize: 14, lineHeight: 22, fontWeight: '600' },
  topGap: { marginTop: 12 },
  cardList: { gap: 12 },
  evidenceCard: {
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    padding: 14,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  evidenceLabel: { color: '#7C3AED', fontSize: 14, fontWeight: '900', marginBottom: 7 },
  positiveText: { color: '#059669' },
  dangerText: { color: '#DC2626', fontWeight: '900' },
  strengthText: { color: '#8B5CF6', fontSize: 12, fontWeight: '900' },
  quoteText: {
    color: '#312E81',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 21,
    marginBottom: 8,
  },
  messageText: {
    color: '#312E81',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 21,
    marginBottom: 8,
  },
  bulletList: { gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletMark: { color: '#8B5CF6', fontSize: 18, fontWeight: '900', marginRight: 8, lineHeight: 22 },
  bulletText: { flex: 1, color: '#64748B', fontSize: 14, lineHeight: 22, fontWeight: '600' },
  emptyText: { fontSize: 16, fontWeight: '800', marginBottom: 18 },
  primaryButton: {
    width: Math.min(width - 40, 440),
    alignSelf: 'center',
    height: 56,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});

export default ResultScreen;
