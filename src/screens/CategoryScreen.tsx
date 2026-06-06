import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CategoryScreenProps {
  onBack: () => void;
  onNext: (category: string) => void;
  isDarkMode: boolean;
}

const categories = [
  { id: '썸', description: '호감 신호와 관계 가능성을 보고 싶을 때' },
  { id: '연애', description: '현재 연인과의 대화 흐름을 분석할 때' },
  { id: '재회', description: '전 연인과의 대화에서 가능성을 확인할 때' },
  { id: '소개팅', description: '첫 만남 전후의 분위기를 파악할 때' },
];

const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onBack,
  onNext,
  isDarkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('썸');

  const theme = {
    background: isDarkMode ? '#111827' : '#F4F2FF',
    header: isDarkMode ? '#1F2937' : '#FFFFFF',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    text: isDarkMode ? '#E5E7EB' : '#374151',
    subText: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#374151' : '#E5E7EB',
    selectedBg: isDarkMode ? '#4C1D95' : '#DDD6FE',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        <Pressable onPress={onBack} style={styles.headerButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.title }]}>카테고리 선택</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.title }]}>어떤 관계를 분석할까요?</Text>

        <View style={styles.categoryList}>
          {categories.map(category => {
            const selected = selectedCategory === category.id;
            return (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryItem,
                  {
                    backgroundColor: selected ? theme.selectedBg : theme.card,
                    borderColor: selected ? '#8B5CF6' : theme.border,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={styles.categoryTextBox}>
                  <Text style={[styles.categoryTitle, { color: selected ? '#4C1D95' : theme.text }]}>
                    {category.id}
                  </Text>
                  <Text style={[styles.categoryDesc, { color: selected ? '#5B21B6' : theme.subText }]}>
                    {category.description}
                  </Text>
                </View>
                <Text style={[styles.checkText, { color: selected ? '#7C3AED' : 'transparent' }]}>✓</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Pressable style={styles.nextButton} onPress={() => onNext(selectedCategory)}>
          <Text style={styles.nextButtonText}>다음 단계로 이동</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  headerButton: { width: 40 },
  backText: { fontSize: 42, color: '#8B5CF6', lineHeight: 42 },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  content: {
    flex: 1,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    width: width * 0.86,
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 34,
  },
  categoryList: {
    width: width * 0.86,
    gap: 14,
  },
  categoryItem: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  categoryTextBox: { flex: 1 },
  categoryTitle: { fontSize: 18, fontWeight: '900', marginBottom: 5 },
  categoryDesc: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  checkText: { fontSize: 22, fontWeight: '900', marginLeft: 10 },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 44,
  },
  nextButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
});

export default CategoryScreen;
