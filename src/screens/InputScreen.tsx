import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface InputScreenProps {
  onBack: () => void;
  onAnalyze: () => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ onBack, onAnalyze }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Simulate image upload for UI demonstration
  const handleUpload = () => {
    // In a real app, use react-native-image-picker
    // Here we use a sample image to show the transition
    setImageUri('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop');
  };

  const isReady = !!imageUri;

  return (
    <View style={styles.screenContainer}>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>대화 내용을 넣어주세요</Text>

        {/* 첫 번째 박스: 이미지 미리보기 */}
        <View style={styles.imagePreviewBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.emptyImageBox} />
          )}
        </View>

        {/* 두 번째 박스: 이미지 업로드 버튼 */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
           <View style={styles.uploadButtonInner} />
        </TouchableOpacity>

        {/* 세 번째 박스: 세부 설명 텍스트 박스 */}
        <View style={styles.descriptionBox}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="상대방과의 대화에 대해 더 자세히 알려주세요! (선택사항)"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* 분석하기 버튼 */}
        <TouchableOpacity
          style={[styles.analyzeButton, isReady ? styles.analyzeButtonActive : styles.analyzeButtonDisabled]}
          onPress={() => isReady && onAnalyze()}
          disabled={!isReady}
        >
          <Text style={[styles.analyzeButtonText, isReady && styles.analyzeButtonTextActive]}>분석하기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Template Decorative Elements (Home Template Style) */}
      <View style={styles.waveLayerContainer}>
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
        <View style={[styles.waveCircle, styles.wave3]} />
      </View>
      <View style={styles.homeIndicatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8F9FE', // Light background consistent with template
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
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
  scrollContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 40,
  },
  imagePreviewBox: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  emptyImageBox: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    width: width * 0.4,
    height: 30,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadButtonInner: {
    width: '60%',
    height: 1,
    backgroundColor: 'transparent',
  },
  descriptionBox: {
    width: width * 0.8,
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    marginBottom: 60,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
  },
  analyzeButton: {
    width: width * 0.8,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  analyzeButtonActive: {
    backgroundColor: '#A78BFA', // Purple from image
    borderColor: '#A78BFA',
  },
  analyzeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  analyzeButtonTextActive: {
    color: '#FFF',
  },
  // Wave Template Elements
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    opacity: 0.3, // Subtle for input screens
  },
  waveCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
  },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.3, left: -width * 0.4, opacity: 0.5 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.45, left: -width * 0.7, opacity: 0.6 },
  wave3: { backgroundColor: '#A78BFA', bottom: -width * 1.55, left: -width * 0.2, opacity: 0.8 },
  homeIndicatorLine: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 140,
    height: 5,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    opacity: 0.2,
  },
});

export default InputScreen;
