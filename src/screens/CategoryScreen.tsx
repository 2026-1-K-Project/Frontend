import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CategoryScreenProps {
  onBack: () => void;
  onNext: (category: string) => void;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ onBack, onNext }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const categories = ['썸', '재회', '환승', '소개팅'];

  const categoryTips = [
    { title: '썸', desc: '상대방의 호감 신호를 확인하고 싶을 때', emoji: '💕' },
    { title: '재회', desc: '이별 후 상대방의 속마음이 궁금할 때', emoji: '🕰️' },
    { title: '환승', desc: '새로운 인연과 과거 인연 사이 고민될 때', emoji: '🛤️' },
    { title: '소개팅', desc: '첫 만남 전후의 분위기를 파악하고 싶을 때', emoji: '☕' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>카테고리 선택</Text>
        <TouchableOpacity onPress={() => setIsHelpOpen(true)} style={styles.headerRight}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoText}>💡</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>지금 어떤 단계인가요?</Text>

        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryItem,
                selectedCategory === cat && styles.categoryItemSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedCategory && styles.nextButtonDisabled]}
          onPress={() => selectedCategory && onNext(selectedCategory)}
          disabled={!selectedCategory}
        >
          <Text style={[styles.nextButtonText, !selectedCategory && { color: '#999' }]}>다음 단계로</Text>
        </TouchableOpacity>
      </View>

      {/* 커스텀 바텀 시트 (도움말) */}
      <Modal
        visible={isHelpOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsHelpOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsHelpOpen(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHandle} />
            <Text style={styles.menuTitle}>카테고리 선택 가이드 💡</Text>
            
            {categoryTips.map((tip, index) => (
              <View key={index} style={styles.helpItem}>
                <View style={styles.helpIconBox}>
                  <Text style={styles.helpEmoji}>{tip.emoji}</Text>
                </View>
                <View style={styles.helpTextBox}>
                  <Text style={styles.helpItemTitle}>{tip.title}</Text>
                  <Text style={styles.helpItemDesc}>{tip.desc}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsHelpOpen(false)}
            >
              <Text style={styles.closeButtonText}>알겠어요!</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Decorative Waves */}
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
        <View style={[styles.waveCircle, styles.wave3]} />
      </View>

      <View style={styles.homeIndicatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6E6FA' },
  header: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#DDD6FE', backgroundColor: '#FFF', zIndex: 10,
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  headerRight: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
  infoBadge: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F5F3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  infoText: { fontSize: 16 },
  content: { flex: 1, paddingTop: 60, alignItems: 'center', zIndex: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#1F2937', marginBottom: 60 },
  categoryList: { width: '100%', alignItems: 'center', gap: 20 },
  categoryItem: {
    width: width * 0.75, height: 60, backgroundColor: '#FFF', borderRadius: 15,
    borderWidth: 1, borderColor: '#C4B5FD', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  categoryItemSelected: { backgroundColor: '#A78BFA', borderColor: '#A78BFA' },
  categoryText: { fontSize: 20, fontWeight: '600', color: '#4B5563' },
  categoryTextSelected: { color: '#FFF' },
  bottomArea: { paddingBottom: 80, alignItems: 'center', zIndex: 10 },
  nextButton: {
    width: width * 0.8, height: 60, backgroundColor: '#8B5CF6', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  nextButtonDisabled: { backgroundColor: '#E5E7EB' },
  nextButtonText: { fontSize: 20, fontWeight: '800', color: '#FFF' },

  // 바텀 시트 모달 스타일
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuContainer: {
    backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingHorizontal: 25, paddingTop: 15, paddingBottom: 40,
  },
  menuHandle: {
    width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20,
  },
  menuTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 25, textAlign: 'center' },
  helpItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  helpIconBox: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F3FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  helpEmoji: { fontSize: 20 },
  helpTextBox: { flex: 1 },
  helpItemTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  helpItemDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  closeButton: {
    marginTop: 10, backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 15, alignItems: 'center',
  },
  closeButtonText: { fontSize: 16, fontWeight: '800', color: '#FFF' },

  waveLayerContainer: { position: 'absolute', bottom: 0, width: '100%', height: '45%' },
  waveCircle: { position: 'absolute', width: width * 2, height: width * 2, borderRadius: width },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.3, left: -width * 0.4, opacity: 0.5 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.45, left: -width * 0.7, opacity: 0.6 },
  wave3: { backgroundColor: '#A78BFA', bottom: -width * 1.55, left: -width * 0.2, opacity: 0.8 },
  homeIndicatorLine: {
    position: 'absolute', bottom: 15, alignSelf: 'center', width: 140, height: 5, backgroundColor: '#8B5CF6', borderRadius: 10, opacity: 0.3,
  },
});

export default CategoryScreen;
