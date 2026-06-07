import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';
import { AttachedItem } from '../types/Api';

const { width } = Dimensions.get('window');

export interface AnalysisNames {
  myName?: string;
  targetName?: string;
}

interface InputScreenProps {
  onBack: () => void;
  onAnalyze: (
    items: AttachedItem[],
    description: string,
    names?: AnalysisNames,
  ) => void | Promise<void>;
  isDarkMode: boolean;
}

const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const InputScreen: React.FC<InputScreenProps> = ({
  onBack,
  onAnalyze,
  isDarkMode,
}) => {
  const [attachedItems, setAttachedItems] = useState<AttachedItem[]>([]);
  const [description, setDescription] = useState('');
  const [myName, setMyName] = useState('');
  const [targetName, setTargetName] = useState('');

  const theme = {
    background: isDarkMode ? '#111827' : '#F8F9FE',
    header: isDarkMode ? '#1F2937' : '#FFFFFF',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    text: isDarkMode ? '#E5E7EB' : '#1F2937',
    subText: isDarkMode ? '#9CA3AF' : '#64748B',
    border: isDarkMode ? '#374151' : '#E2E8F0',
    disabled: isDarkMode ? '#374151' : '#E5E7EB',
  };

  const handlePickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0,
    });

    if (result.didCancel) return;

    const images: AttachedItem[] = (result.assets || [])
      .filter(asset => !!asset.uri)
      .map(asset => ({
        id: makeId(),
        uri: asset.uri || '',
        name: asset.fileName || 'chat-image.jpg',
        type: 'image',
        mimeType: asset.type || 'image/jpeg',
      }));

    setAttachedItems(prev => [...prev, ...images]);
  };

  const handlePickFiles = async () => {
    try {
      const results = await pick({
        allowMultiSelection: true,
        type: ['text/plain', 'image/*'],
      });

      const files: AttachedItem[] = results.map((file: any) => ({
        id: makeId(),
        uri: file.uri,
        name: file.name || 'chat.txt',
        type: file.type?.startsWith('image/') ? 'image' : 'file',
        mimeType: file.type || 'text/plain',
      }));

      setAttachedItems(prev => [...prev, ...files]);
    } catch (error: any) {
      if (error?.code !== 'OPERATION_CANCELED') {
        Alert.alert('파일 선택 실패', '파일을 불러오지 못했습니다.');
      }
    }
  };

  const removeItem = (id: string) => {
    setAttachedItems(prev => prev.filter(item => item.id !== id));
  };

  const isReady = attachedItems.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.title }]}>대화 파일 업로드</Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: theme.title }]}>
            카카오톡 txt 파일이나 대화 캡처 이미지를 올려주세요
          </Text>

          <View style={[styles.attachmentBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {attachedItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {attachedItems.map(item => (
                  <View key={item.id} style={styles.itemWrapper}>
                    {item.type === 'image' ? (
                      <Image source={{ uri: item.uri }} style={styles.preview} resizeMode="cover" />
                    ) : (
                      <View style={[styles.filePreview, { backgroundColor: isDarkMode ? '#374151' : '#F5F3FF' }]}>
                        <Text style={styles.fileIcon}>TXT</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
                      <Text style={styles.removeText}>×</Text>
                    </TouchableOpacity>
                    <Text style={[styles.itemName, { color: theme.subText }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={[styles.emptyText, { color: theme.subText }]}>
                아직 첨부한 파일이 없습니다.
              </Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImages}>
              <Text style={styles.uploadButtonText}>사진 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadButton, styles.fileButton]} onPress={handlePickFiles}>
              <Text style={styles.uploadButtonText}>파일 추가</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nameRow}>
            <View style={[styles.nameInputBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                style={[styles.nameInput, { color: theme.text }]}
                placeholder="내 이름"
                placeholderTextColor={theme.subText}
                value={myName}
                onChangeText={setMyName}
                returnKeyType="next"
              />
            </View>
            <View style={[styles.nameInputBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                style={[styles.nameInput, { color: theme.text }]}
                placeholder="상대방 이름"
                placeholderTextColor={theme.subText}
                value={targetName}
                onChangeText={setTargetName}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={[styles.descriptionBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              multiline
              placeholder="궁금한 점을 적어주세요. 예: 상대방이 나에게 호감이 있는지 알고 싶어요."
              placeholderTextColor={theme.subText}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: isReady ? '#8B5CF6' : theme.disabled }]}
            onPress={() => isReady && onAnalyze(attachedItems, description, {
              myName: myName.trim(),
              targetName: targetName.trim(),
            })}
            disabled={!isReady}
          >
            <Text style={[styles.analyzeButtonText, { color: isReady ? '#FFFFFF' : theme.subText }]}>
              분석 시작하기
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
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
  scrollContent: { alignItems: 'center', paddingTop: 32, paddingBottom: 80 },
  title: {
    width: width * 0.86,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },
  attachmentBox: {
    width: width * 0.86,
    minHeight: 170,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 14,
    marginBottom: 18,
  },
  emptyText: { textAlign: 'center', fontSize: 15, fontWeight: '600' },
  itemWrapper: { width: 96, marginRight: 12, alignItems: 'center' },
  preview: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F3F4F6' },
  filePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIcon: { fontSize: 16, fontWeight: '900', color: '#7C3AED' },
  removeButton: {
    position: 'absolute',
    top: -7,
    right: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900', lineHeight: 18 },
  itemName: { width: 84, marginTop: 8, fontSize: 11, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  uploadButton: {
    width: width * 0.36,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileButton: { backgroundColor: '#7C3AED' },
  uploadButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  nameRow: {
    width: width * 0.86,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  nameInputBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  nameInput: { fontSize: 14, fontWeight: '700' },
  descriptionBox: {
    width: width * 0.86,
    height: 124,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 28,
  },
  textInput: { flex: 1, fontSize: 15, textAlignVertical: 'top' },
  analyzeButton: {
    width: width * 0.82,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: { fontSize: 17, fontWeight: '900' },
});

export default InputScreen;
