import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CategoryScreenProps {
  onBack: () => void;
  onNext: (category: string) => void;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ onBack, onNext }) => {
  const [selected, setSelected] = useState('');

  const categories = ['썸', '재회', '환승', '소개팅'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 채팅 분석</Text>
        <View style={styles.headerRight}>
          <Text style={styles.dotsIcon}>●●●</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>카테고리를 선택해주세요</Text>

        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryItem,
                selected === cat && styles.categoryItemSelected,
              ]}
              onPress={() => setSelected(cat)}
            >
              <Text style={[
                styles.categoryText,
                selected === cat && styles.categoryTextSelected
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          onPress={() => selected && onNext(selected)}
          disabled={!selected}
        >
          <Text style={styles.nextButtonText}>다음 단계</Text>
        </TouchableOpacity>
      </View>

      {/* Template Background Elements */}
      <View style={styles.waveLayerContainer}>
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
        <View style={[styles.waveCircle, styles.wave3]} />
        <Text style={styles.sparkle1}>✦</Text>
        <Text style={styles.sparkle2}>✦</Text>
        <Text style={styles.sparkle3}>✦</Text>
      </View>
      <View style={styles.homeIndicatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6FE',
    backgroundColor: '#FFF', // Keeping header white as per image
  },
  headerBtn: {
    width: 40,
  },
  backIcon: {
    fontSize: 40,
    color: '#8B5CF6',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  dotsIcon: {
    fontSize: 12,
    color: '#D1D5DB',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 60,
  },
  categoryList: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  categoryItem: {
    width: width * 0.7,
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItemSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  categoryTextSelected: {
    color: '#FFF',
  },
  bottomArea: {
    paddingBottom: 80,
    alignItems: 'center',
    zIndex: 10,
  },
  nextButton: {
    width: width * 0.75,
    height: 60,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  // Wave Template
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
    backgroundColor: '#DDD6FE',
    bottom: -width * 1.3,
    left: -width * 0.4,
    opacity: 0.5,
  },
  wave2: {
    backgroundColor: '#C4B5FD',
    bottom: -width * 1.45,
    left: -width * 0.7,
    opacity: 0.6,
  },
  wave3: {
    backgroundColor: '#A78BFA',
    bottom: -width * 1.55,
    left: -width * 0.2,
    opacity: 0.8,
  },
  sparkle1: { position: 'absolute', bottom: '65%', left: '20%', color: '#FFF', fontSize: 20, opacity: 0.8 },
  sparkle2: { position: 'absolute', bottom: '80%', left: '40%', color: '#FFF', fontSize: 14, opacity: 0.6 },
  sparkle3: { position: 'absolute', bottom: '55%', right: '25%', color: '#FFF', fontSize: 24, opacity: 0.8 },
  homeIndicatorLine: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 140,
    height: 5,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    opacity: 0.3,
  },
});

export default CategoryScreen;
