import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Pressable, // [수정] 터치 순간의 색상 변화를 위해 Pressable 사용
} from 'react-native';

const { width } = Dimensions.get('window');

interface CategoryScreenProps {
  onBack: () => void;
  onNext: (category: string) => void;
  isDarkMode: boolean;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onBack,
  onNext,
  isDarkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const categories = [
    { id: '썸', emoji: '💕' },
    { id: '재회', emoji: '🕰️' },
    { id: '환승', emoji: '🛤️' },
    { id: '소개팅', emoji: '☕' },
  ];

  const categoryTips = [
    { title: '썸', desc: '상대방의 호감 신호를 확인하고 싶을 때', emoji: '💕' },
    { title: '재회', desc: '이별 후 상대방의 속마음이 궁금할 때', emoji: '🕰️' },
    { title: '환승', desc: '새로운 인연과 과거 인연 사이 고민될 때', emoji: '🛤️' },
    { title: '소개팅', desc: '첫 만남 전후의 분위기를 파악하고 싶을 때', emoji: '☕' },
  ];

  const theme = {
    background: isDarkMode ? '#111827' : '#F4F2FF',
    header: isDarkMode ? '#1F2937' : '#FFF',
    card: isDarkMode ? '#1F2937' : '#FFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    text: isDarkMode ? '#E5E7EB' : '#374151',
    subText: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#374151' : '#E5E7EB',
    modal: isDarkMode ? '#1F2937' : '#FFF',
    badge: isDarkMode ? '#374151' : '#F5F3FF',
    handle: isDarkMode ? '#4B5563' : '#E2E8F0',
    wave1: isDarkMode ? '#312E81' : '#DDD6FE',
    wave2: isDarkMode ? '#4C1D95' : '#C4B5FD',
    wave3: isDarkMode ? '#6D28D9' : '#A78BFA',

    // [컬러 셋팅]
    normalPurple: '#A78BFA',      // 기본 연보라
    pressedPurple: '#5B21B6',     // [수정] 클릭(누르고 있을 때) 순간 바뀔 진한 보라색
    disabledColor: isDarkMode ? '#1F2937' : '#E5E7EB',

    selectedCardBg: isDarkMode ? '#5B21B6' : '#DDD6FE',
    selectedCardBorder: isDarkMode ? '#A78BFA' : '#C4B5FD',
    selectedCardText: isDarkMode ? '#F9FAFB' : '#4C1D95',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 헤더 영역 */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.header,
            borderBottomColor: isDarkMode ? '#374151' : '#F3F4F6',
          },
        ]}
      >
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Text style={[styles.backIcon, { color: theme.normalPurple }]}>‹</Text>
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.title }]}>
          카테고리 선택
        </Text>

        <Pressable
          onPress={() => setIsHelpOpen(true)}
          style={styles.headerRight}
        >
          <View style={[styles.infoBadge, { backgroundColor: theme.badge }]}>
            <Text style={styles.infoText}>💡</Text>
          </View>
        </Pressable>
      </View>

      {/* 바디 콘텐츠 영역 */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.title }]}>
          지금 어떤 단계인가요?
        </Text>

        <View style={styles.categoryList}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryItem,
                  {
                    backgroundColor: isSelected ? theme.selectedCardBg : theme.card,
                    borderColor: isSelected ? theme.selectedCardBorder : theme.border,
                  },
                  isSelected && {
                    shadowColor: theme.normalPurple,
                    ...styles.categoryItemSelectedShadow,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>

                <View style={styles.categoryCenterSection}>
                  <Text
                    style={[
                      styles.categoryText,
                      { color: isSelected ? theme.selectedCardText : theme.text },
                    ]}
                  >
                    {cat.id} 단계
                  </Text>
                </View>

                <View style={styles.rightIndicatorContainer}>
                  {isSelected && (
                    <View style={[styles.checkIndicator, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(76,29,149,0.15)' }]}>
                      <Text style={[styles.checkText, { color: theme.selectedCardText }]}>✓</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomArea}>
        <Pressable
          // [수정]disabled 상태가 아닐 때, 눌리는 순간(pressed) 동적으로 진한 색상 스타일을 반영합니다.
          style={({ pressed }) => [
            styles.nextButton,
            {
              backgroundColor: !selectedCategory
                ? theme.disabledColor
                : pressed
                  ? theme.pressedPurple  // 클릭하는 순간 진하게 변경!
                  : theme.normalPurple,  // 평소 연보라색
              shadowColor: theme.normalPurple,
            },
            !selectedCategory && { elevation: 0, shadowOpacity: 0 },
          ]}
          onPress={() => selectedCategory && onNext(selectedCategory)}
          disabled={!selectedCategory}
        >
          <Text
            style={[
              styles.nextButtonText,
              {
                color: selectedCategory
                  ? '#FFFFFF'
                  : (isDarkMode ? '#4B5563' : '#9CA3AF')
              }
            ]}
          >
            다음 단계로 이동하기 →
          </Text>
        </Pressable>
      </View>

      {/* 도움말 모달 */}
      <Modal
        visible={isHelpOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsHelpOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsHelpOpen(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: theme.modal }]}>
            <View style={[styles.menuHandle, { backgroundColor: theme.handle }]} />

            <Text style={[styles.menuTitle, { color: theme.title }]}>
              카테고리 선택 가이드 💡
            </Text>

            {categoryTips.map((tip, index) => (
              <View key={index} style={styles.helpItem}>
                <View
                  style={[styles.helpIconBox, { backgroundColor: theme.badge }]}
                >
                  <Text style={styles.helpEmoji}>{tip.emoji}</Text>
                </View>

                <View style={styles.helpTextBox}>
                  <Text style={[styles.helpItemTitle, { color: theme.title }]}>
                    {tip.title}
                  </Text>
                  <Text style={[styles.helpItemDesc, { color: theme.subText }]}>
                    {tip.desc}
                  </Text>
                </View>
              </View>
            ))}

            <Pressable
              // [수정] 도움말 모달 확인 버튼도 클릭 순간 진하게 스타일 분기 적용
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: pressed ? theme.pressedPurple : theme.normalPurple }
              ]}
              onPress={() => setIsHelpOpen(false)}
            >
              <Text style={styles.closeButtonText}>확인했습니다!</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 하단 웨이브 배경 */}
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1, { backgroundColor: theme.wave1 }]} />
        <View style={[styles.waveCircle, styles.wave2, { backgroundColor: theme.wave2 }]} />
        <View style={[styles.waveCircle, styles.wave3, { backgroundColor: theme.wave3 }]} />
      </View>

      <View style={[styles.homeIndicatorLine, { backgroundColor: theme.normalPurple }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerBtn: { width: 40, justifyContent: 'center' },
  backIcon: { fontSize: 34, marginTop: -2 },
  headerTitle: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  infoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { fontSize: 14 },
  content: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 44,
    letterSpacing: -0.4,
  },
  categoryList: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  categoryItem: {
    width: width * 0.82,
    height: 64,
    borderRadius: 16,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryItemSelectedShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryEmoji: {
    fontSize: 18,
    position: 'absolute',
    left: 20,
    zIndex: 5,
  },
  categoryCenterSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  rightIndicatorContainer: {
    position: 'absolute',
    right: 20,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 12,
    fontWeight: '800',
  },
  bottomArea: {
    paddingBottom: 80,
    alignItems: 'center',
    zIndex: 10,
  },
  nextButton: {
    width: width * 0.82,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 40,
  },
  menuHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  helpIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  helpEmoji: { fontSize: 18 },
  helpTextBox: { flex: 1 },
  helpItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  helpItemDesc: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
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

export default CategoryScreen;