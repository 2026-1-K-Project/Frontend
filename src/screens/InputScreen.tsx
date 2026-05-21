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
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

interface InputScreenProps {
  onBack: () => void;
  onAnalyze: (imageUri: string, description: string) => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ onBack, onAnalyze }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // 갤러리 접근 권한 확인 및 요청
  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const version = Number(Platform.Version);
      let granted;

      if (version >= 33) {
        // Android 13 이상
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
      } else {
        // Android 13 미만
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
      }

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleUpload = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('권한 거부', '이미지를 불러오기 위해 갤러리 접근 권한이 필요합니다.');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri || null);
      }
    } catch (error) {
      Alert.alert('오류', '갤러리를 여는 중 문제가 발생했습니다.');
    }
  };

  const isReady = !!imageUri;

  return (
    <View style={styles.container}>
      {/* 배경 장식 (가장 뒤로 배치) */}
      <View style={styles.backgroundDecoration} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
        <View style={[styles.waveCircle, styles.wave3]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 채팅 분석</Text>
          <View style={styles.headerRight}>
            <Text style={styles.dotsIcon}>●●●</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>대화 내용을 넣어주세요</Text>

          {/* 박스 1: 이미지 미리보기 (클릭 시에도 갤러리 오픈) */}
          <TouchableOpacity
            style={styles.imagePreviewBox}
            onPress={handleUpload}
            activeOpacity={0.9}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
            ) : (
              <View style={styles.emptyImageBox}>
                <Text style={styles.emptyText}>이미지를 첨부해 주세요</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 박스 2: 이미지 업로드 버튼 */}
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} activeOpacity={0.7}>
             <Text style={styles.uploadButtonText}>갤러리에서 선택</Text>
          </TouchableOpacity>

          {/* 박스 3: 세부 설명 */}
          <View style={styles.descriptionBox}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="AI에게 궁금한 점이나 요구사항을 적어주세요."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          {/* 분석하기 버튼 */}
          <TouchableOpacity
            style={[styles.analyzeButton, isReady ? styles.analyzeButtonActive : styles.analyzeButtonDisabled]}
            onPress={() => isReady && onAnalyze(imageUri!, description)}
            disabled={!isReady}
            activeOpacity={0.8}
          >
            <Text style={[styles.analyzeButtonText, isReady && styles.analyzeButtonTextActive]}>분석하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  backgroundDecoration: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  waveCircle: { position: 'absolute', width: width * 2, height: width * 2, borderRadius: width, opacity: 0.1 },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.3, left: -width * 0.4 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.45, left: -width * 0.7 },
  wave3: { backgroundColor: '#A78BFA', bottom: -width * 1.55, left: -width * 0.2 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE', zIndex: 10 },
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  dotsIcon: { fontSize: 12, color: '#D1D5DB', letterSpacing: 2 },
  scrollContent: { alignItems: 'center', paddingTop: 40, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 35 },
  imagePreviewBox: { width: width * 0.8, height: width * 0.8, backgroundColor: '#FFF', borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 20, elevation: 2 },
  emptyImageBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 15 },
  previewImage: { width: '100%', height: '100%' },
  uploadButton: { width: width * 0.45, height: 44, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  uploadButtonText: { fontSize: 15, fontWeight: '600', color: '#8B5CF6' },
  descriptionBox: { width: width * 0.85, height: 120, backgroundColor: '#FFF', borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', padding: 5, marginBottom: 50 },
  textInput: { flex: 1, fontSize: 16, color: '#1F2937', padding: 15 },
  analyzeButton: { width: width * 0.85, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  analyzeButtonDisabled: { backgroundColor: '#E5E7EB' },
  analyzeButtonActive: { backgroundColor: '#8B5CF6' },
  analyzeButtonText: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  analyzeButtonTextActive: { color: '#FFF' },
});

export default InputScreen;
