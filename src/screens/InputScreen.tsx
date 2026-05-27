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
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'; // 파일 선택기 추가

const { width, height } = Dimensions.get('window');

interface AttachedItem {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'file';
}

interface InputScreenProps {
  onBack: () => void;
  onAnalyze: (items: AttachedItem[], description: string) => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ onBack, onAnalyze }) => {
  const [attachedItems, setAttachedItems] = useState<AttachedItem[]>([]);
  const [description, setDescription] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 이미지 다중 선택 함수
  const handlePickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0, // 0은 제한 없음을 의미
      quality: 1,
    });

    if (result.assets) {
      const newImages: AttachedItem[] = result.assets.map(asset => ({
        id: Math.random().toString(36).substr(2, 9),
        uri: asset.uri || '',
        name: asset.fileName || 'image.jpg',
        type: 'image'
      }));
      setAttachedItems(prev => [...prev, ...newImages]);
    }
  };

  // 파일 선택 함수
  const handlePickFiles = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const newFiles: AttachedItem[] = results.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        uri: file.uri,
        name: file.name || 'document',
        type: 'file'
      }));
      setAttachedItems(prev => [...prev, ...newFiles]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
      }
    }
  };

  const removeItem = (id: string) => {
    setAttachedItems(prev => prev.filter(item => item.id !== id));
  };

  const isReady = attachedItems.length > 0;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1]} />
        <View style={[styles.waveCircle, styles.wave2]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>분석 데이터 입력</Text>
          <TouchableOpacity onPress={() => setIsHelpOpen(true)} style={styles.headerRight}>
            <View style={styles.helpIconBadge}>
              <Text style={styles.helpIconText}>?</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>대화 내용을 첨부해 주세요</Text>

          {/* 첨부된 아이템 목록 영역 */}
          <View style={styles.attachmentArea}>
            {attachedItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsList}>
                {attachedItems.map((item) => (
                  <View key={item.id} style={styles.itemWrapper}>
                    {item.type === 'image' ? (
                      <Image source={{ uri: item.uri }} style={styles.itemPreview} />
                    ) : (
                      <View style={[styles.itemPreview, styles.fileIconBox]}>
                        <Text style={styles.fileEmoji}>📄</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>사진이나 파일을 추가해 주세요</Text>
              </View>
            )}
          </View>

          {/* 업로드 버튼 그룹 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.pickButton} onPress={handlePickImages}>
               <Text style={styles.pickButtonText}>📷 사진 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pickButton, { backgroundColor: '#8B5CF6' }]} onPress={handlePickFiles}>
               <Text style={[styles.pickButtonText, { color: '#FFF' }]}>📂 파일 추가</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionBox}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="AI에게 전달할 특이사항이나 궁금한 점을 적어주세요."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[styles.analyzeButton, isReady ? styles.analyzeButtonActive : styles.analyzeButtonDisabled]}
            onPress={() => isReady && onAnalyze(attachedItems, description)}
            disabled={!isReady}
          >
            <Text style={[styles.analyzeButtonText, isReady && styles.analyzeButtonTextActive]}>분석 시작하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isHelpOpen} transparent={true} animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setIsHelpOpen(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHandle} />
            <Text style={styles.menuTitle}>첨부 가이드 💡</Text>
            <Text style={styles.helpText}>• 여러 장의 이미지를 동시에 분석할 수 있습니다.{"\n"}• PDF나 텍스트 파일 형식의 대화록도 지원합니다.{"\n"}• 대화 맥락이 잘 보이도록 순서대로 첨부해 주세요.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsHelpOpen(false)}>
              <Text style={styles.closeButtonText}>알겠어요!</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#FFF', zIndex: 10 },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  helpIconBadge: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  helpIconText: { color: '#8B5CF6', fontSize: 15, fontWeight: '900' },
  scrollContent: { alignItems: 'center', paddingTop: 30, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 30 },
  
  attachmentArea: { width: width * 0.9, height: 180, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  itemsList: { padding: 15 },
  itemWrapper: { width: 100, marginRight: 15, alignItems: 'center' },
  itemPreview: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F3F4F6' },
  fileIconBox: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
  fileEmoji: { fontSize: 30 },
  itemName: { fontSize: 11, color: '#64748B', marginTop: 5, width: 80, textAlign: 'center' },
  removeBtn: { position: 'absolute', top: -5, right: 5, backgroundColor: '#EF4444', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  removeBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  emptyBox: { flex: 1, justifyContent: 'center' },
  emptyText: { color: '#94A3B8' },

  buttonGroup: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  pickButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#DDD', elevation: 2 },
  pickButtonText: { fontSize: 14, fontWeight: '700', color: '#4B5563' },

  descriptionBox: { width: width * 0.9, height: 120, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 15, marginBottom: 40 },
  textInput: { flex: 1, fontSize: 16, color: '#1F2937', textAlignVertical: 'top' },
  analyzeButton: { width: width * 0.8, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  analyzeButtonDisabled: { backgroundColor: '#E5E7EB' },
  analyzeButtonActive: { backgroundColor: '#8B5CF6', elevation: 5 },
  analyzeButtonText: { fontSize: 18, fontWeight: '800', color: '#94A3B8' },
  analyzeButtonTextActive: { color: '#FFF' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  menuHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  menuTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 15, textAlign: 'center' },
  helpText: { fontSize: 15, color: '#64748B', lineHeight: 24, marginBottom: 25 },
  closeButton: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  closeButtonText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  
  waveLayerContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.2 },
  waveCircle: { position: 'absolute', width: width * 2, height: width * 2, borderRadius: width },
  wave1: { backgroundColor: '#DDD6FE', bottom: -width * 1.3, left: -width * 0.4 },
  wave2: { backgroundColor: '#C4B5FD', bottom: -width * 1.45, left: -width * 0.7 },
});

export default InputScreen;
