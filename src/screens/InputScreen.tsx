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
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

interface InputScreenProps {
  onBack: () => void;
  onAnalyze: (imageUri: string, description: string) => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ onBack, onAnalyze }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const uploadTips = [
    { title: '전체 캡쳐', desc: '대화 내용이 잘 보이도록 전체 화면을 캡처해주세요.', emoji: '📸' },
    { title: '말풍선 포함', desc: '상대방과 본인의 말풍선이 모두 포함되어야 정확해요.', emoji: '💬' },
    { title: '선명한 화질', desc: '사진 속 글자가 선명할수록 AI가 맥락을 더 잘 읽어냅니다.', emoji: '✨' },
    { title: '익명성 보장', desc: '상대방의 이름이 가려져 있어도 분석이 가능합니다.', emoji: '🔒' },
  ];

  const handleUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri || null);
    }
  };

  const isReady = !!imageUri;

  return (
    <View style={styles.screenContainer}>
      {/* 배경 장식 */}
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>이미지 업로드</Text>
          <TouchableOpacity onPress={() => setIsHelpOpen(true)} style={styles.headerRight}>
            <View style={styles.helpIconBadge}>
              <Text style={styles.helpIconText}>?</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>대화 내용을 넣어주세요</Text>

          <View style={styles.imagePreviewBox}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
            ) : (
              <View style={styles.emptyImageBox}>
                <Text style={styles.emptyText}>이미지를 첨부해 주세요</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
             <Text style={styles.uploadButtonText}>갤러리에서 선택</Text>
          </TouchableOpacity>

          <View style={styles.descriptionBox}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="AI에게 궁금한 점이나 요구사항을 적어주세요. (예: 이 사람 진심이 뭘까요?)"
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[styles.analyzeButton, isReady ? styles.analyzeButtonActive : styles.analyzeButtonDisabled]}
            onPress={() => isReady && onAnalyze(imageUri!, description)}
            disabled={!isReady}
          >
            <Text style={[styles.analyzeButtonText, isReady && styles.analyzeButtonTextActive]}>분석 시작하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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
            <Text style={styles.menuTitle}>이미지 업로드 가이드 ❓</Text>
            
            {uploadTips.map((tip, index) => (
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

      <View style={styles.homeIndicatorLine} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#FFF', zIndex: 10,
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  headerRight: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
  helpIconBadge: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#8B5CF6',
    alignItems: 'center', justifyContent: 'center',
  },
  helpIconText: { color: '#8B5CF6', fontSize: 15, fontWeight: '900' },

  scrollContent: { alignItems: 'center', paddingTop: 50, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '800', color: '#1F2937', marginBottom: 40 },
  imagePreviewBox: {
    width: width * 0.8, height: width * 0.8, backgroundColor: '#FFF', borderRadius: 20,
    borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', marginBottom: 20, elevation: 2,
  },
  emptyImageBox: { flex: 1, justifyContent: 'center' },
  emptyText: { color: '#94A3B8', fontWeight: '500' },
  previewImage: { width: '100%', height: '100%' },
  uploadButton: {
    width: width * 0.4, height: 40, backgroundColor: '#8B5CF6', borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
  },
  uploadButtonText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  descriptionBox: {
    width: width * 0.8, height: 120, backgroundColor: '#FFF', borderRadius: 20,
    borderWidth: 1, borderColor: '#E2E8F0', padding: 15, marginBottom: 60,
  },
  textInput: { flex: 1, fontSize: 16, color: '#1F2937', textAlignVertical: 'top' },
  analyzeButton: {
    width: width * 0.8, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  analyzeButtonDisabled: { backgroundColor: '#E5E7EB' },
  analyzeButtonActive: { backgroundColor: '#8B5CF6', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  analyzeButtonText: { fontSize: 18, fontWeight: '800', color: '#94A3B8' },
  analyzeButtonTextActive: { color: '#FFF' },

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

  waveLayerContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.2 },
  waveCircle: { position: 'absolute', width: width * 2, height: width * 2, borderRadius: width },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.3, left: -width * 0.4 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.45, left: -width * 0.7 },
  homeIndicatorLine: {
    position: 'absolute', bottom: 15, alignSelf: 'center', width: 140, height: 5, backgroundColor: '#8B5CF6', borderRadius: 10, opacity: 0.2,
  },
});

export default InputScreen;
