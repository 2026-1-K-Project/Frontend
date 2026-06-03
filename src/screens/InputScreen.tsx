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
import { pick } from '@react-native-documents/picker';

const { width } = Dimensions.get('window');

type AttachedItem = {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'file';
  mimeType?: string | null;
};

interface InputScreenProps {
  onBack: () => void;
  onAnalyze: (items: AttachedItem[], description: string) => void;
  isDarkMode: boolean;
}

const InputScreen: React.FC<InputScreenProps> = ({
  onBack,
  onAnalyze,
  isDarkMode,
}) => {
  const [attachedItems, setAttachedItems] = useState<AttachedItem[]>([]);
  const [description, setDescription] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const uploadTips = [
    { title: '전체 캡쳐', desc: '대화 내용이 잘 보이도록 전체 화면을 캡처해주세요.', emoji: '📸' },
    { title: '말풍선 포함', desc: '상대방과 본인의 말풍선이 모두 포함되어야 정확해요.', emoji: '💬' },
    { title: '파일 첨부', desc: '텍스트 파일이나 문서 파일도 함께 첨부할 수 있어요.', emoji: '📄' },
    { title: '익명성 보장', desc: '상대방의 이름이 가려져 있어도 분석이 가능합니다.', emoji: '🔒' },
  ];

  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFF',
    card: isDarkMode ? '#1F2937' : '#FFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    text: isDarkMode ? '#E5E7EB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#374151' : '#E2E8F0',
    modal: isDarkMode ? '#1F2937' : '#FFF',
    badge: isDarkMode ? '#374151' : '#F5F3FF',
    handle: isDarkMode ? '#4B5563' : '#E2E8F0',
    wave1: isDarkMode ? '#312E81' : '#DDD6FE',
    wave2: isDarkMode ? '#4C1D95' : '#C4B5FD',
    disabled: isDarkMode ? '#374151' : '#E5E7EB',
  };

  const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const handlePickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0,
    });

    if (result.assets && result.assets.length > 0) {
      const newImages: AttachedItem[] = result.assets
        .filter(asset => !!asset.uri)
        .map(asset => ({
          id: makeId(),
          uri: asset.uri || '',
          name: asset.fileName || 'image.jpg',
          type: 'image',
          mimeType: asset.type,
        }));

      setAttachedItems(prev => [...prev, [...newImages]]);
    }
  };

  const handlePickFiles = async () => {
    try {
      const results = await pick({
        allowMultiSelection: true,
        type: ['*/*'],
      });

      const newFiles: AttachedItem[] = results.map(file => ({
        id: makeId(),
        uri: file.uri,
        name: file.name || 'document',
        type: 'file',
        mimeType: file.type,
      }));

      setAttachedItems(prev => [...prev, ...newFiles]);
    } catch (error: any) {
      if (error?.code !== 'OPERATION_CANCELED') {
        console.log('File pick error:', error);
      }
    }
  };

  const removeItem = (id: string) => {
    setAttachedItems(prev => prev.filter(item => item.id !== id));
  };

  const isReady = attachedItems.length > 0;

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.waveLayerContainer} pointerEvents="none">
        <View style={[styles.waveCircle, styles.wave1, { backgroundColor: theme.wave1 }]} />
        <View style={[styles.waveCircle, styles.wave2, { backgroundColor: theme.wave2 }]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.header,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.title }]}>
            파일 업로드
          </Text>

          <TouchableOpacity
            onPress={() => setIsHelpOpen(true)}
            style={styles.headerRight}
          >
            <View
              style={[
                styles.helpIconBadge,
                {
                  backgroundColor: theme.badge,
                  borderColor: '#8B5CF6',
                },
              ]}
            >
              <Text style={styles.helpIconText}>?</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 상단 타이틀 멘트 */}
          <Text style={[styles.title, { color: theme.title }]} numberOfLines={1}>
            🔮 마음이 궁금한 그 사람과의 대화를 들려주세요!
          </Text>

          <View
            style={[
              styles.attachmentBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {attachedItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {attachedItems.map(item => (
                  <View key={item.id} style={styles.itemWrapper}>
                    {item.type === 'image' ? (
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.itemPreview}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.filePreview,
                          { backgroundColor: isDarkMode ? '#374151' : '#F5F3FF' },
                        ]}
                      >
                        <Text style={styles.fileIcon}>📄</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>

                    <Text
                      style={[styles.itemName, { color: theme.subText }]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyImageBox}>
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  사진이나 파일을 첨부해 주세요.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImages}>
              <Text style={styles.uploadButtonText}>📷 사진 추가</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, styles.fileButton]}
              onPress={handlePickFiles}
            >
              <Text style={styles.uploadButtonText}>📂 파일 추가</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.descriptionBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              multiline
              placeholder="AI에게 궁금한 점이나 요구사항을 적어주세요. (예: 이 사람 진심이 뭘까요?)"
              placeholderTextColor={isDarkMode ? '#9CA3AF' : '#94A3B8'}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.analyzeButton,
              isReady
                ? styles.analyzeButtonActive
                : { backgroundColor: theme.disabled },
            ]}
            onPress={() => isReady && onAnalyze(attachedItems, description)}
            disabled={!isReady}
          >
            <Text
              style={[
                styles.analyzeButtonText,
                isReady && styles.analyzeButtonTextActive,
                !isReady && { color: isDarkMode ? '#9CA3AF' : '#94A3B8' },
              ]}
            >
              분석 시작하기
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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
              첨부 가이드 ❓
            </Text>

            {uploadTips.map((tip, index) => (
              <View key={index} style={styles.helpItem}>
                <View style={[styles.helpIconBox, { backgroundColor: theme.badge }]}>
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
  screenContainer: { flex: 1 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerBtn: { width: 40 },
  backIcon: { fontSize: 40, color: '#8B5CF6' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerRight: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
  helpIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIconText: { color: '#8B5CF6', fontSize: 15, fontWeight: '900' },
  scrollContent: { alignItems: 'center', paddingTop: 35, paddingBottom: 100 },

  /* [수정] 무조건 한 줄로 나오도록 크기 조절 및 자간 간격 최적화 */
  title: {
    fontSize: 17.5,               // 한 줄 처리를 위해 안정적인 크기로 하향 조정
    fontWeight: '800',
    marginBottom: 35,
    textAlign: 'center',
    letterSpacing: -0.4,          // 자간을 좁혀 글자 뭉침 및 한 줄 유지력 강화
    paddingHorizontal: width * 0.05,
  },

  attachmentBox: {
    width: width * 0.85,
    height: 170,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
  },
  emptyImageBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontWeight: '500' },
  itemWrapper: {
    width: 95,
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  itemPreview: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  filePreview: {
    width: 80,
    height: 80,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcon: { fontSize: 32 },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '800',
  },
  itemName: {
    width: 82,
    marginTop: 8,
    fontSize: 11,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  uploadButton: {
    width: width * 0.35,
    height: 42,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileButton: {
    backgroundColor: '#7C3AED',
  },
  uploadButtonText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  descriptionBox: {
    width: width * 0.85,
    height: 120,
    borderRadius: 20,
    borderWidth: 1,
    padding: 15,
    marginBottom: 60,
  },
  textInput: { flex: 1, fontSize: 16, textAlignVertical: 'top' },
  analyzeButton: {
    width: width * 0.8,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButtonActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  analyzeButtonText: { fontSize: 18, fontWeight: '800' },
  analyzeButtonTextActive: { color: '#FFF' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    fontWeight: '800',
    marginBottom: 25,
    textAlign: 'center',
  },
  helpItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  helpIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  helpEmoji: { fontSize: 20 },
  helpTextBox: { flex: 1 },
  helpItemTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  helpItemDesc: { fontSize: 13, lineHeight: 18 },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeButtonText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  waveLayerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.2,
  },
  waveCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
  },
  wave1: { bottom: -width * 1.3, left: -width * 0.4 },
  wave2: { bottom: -width * 1.45, left: -width * 0.7 },
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