import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { backendApi } from '../api/backend';
import { AuthUser } from '../types/Api';

const { width } = Dimensions.get('window');

interface LoginpageProps {
  onLogin: (user: AuthUser) => void | Promise<void>;
  isDarkMode: boolean;
}

const Loginpage: React.FC<LoginpageProps> = ({ onLogin, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = {
    background: isDarkMode ? '#111827' : '#F5F3FF',
    title: isDarkMode ? '#F9FAFB' : '#6D28D9',
    text: isDarkMode ? '#F5F3FF' : '#312E81',
    subText: isDarkMode ? '#C4B5FD' : '#7C3AED',
    card: isDarkMode ? '#1F2937' : '#FFFFFF',
    inputBg: isDarkMode ? '#111827' : '#FFFFFF',
    inputText: isDarkMode ? '#F9FAFB' : '#1F2937',
    border: isDarkMode ? '#4B5563' : '#E9D5FF',
    placeholder: isDarkMode ? '#9CA3AF' : '#A78BFA',
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
      Alert.alert('입력 필요', '필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = isLogin
        ? await backendApi.login(email.trim(), password)
        : await backendApi.signup(name.trim(), email.trim(), password);
      await onLogin({
        memberId: user.memberId,
        email: user.email,
        name: user.name,
      });
    } catch (error: any) {
      Alert.alert(
        isLogin ? '로그인 실패' : '회원가입 실패',
        error?.message || '요청을 처리하지 못했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>AI</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.title }]}>AI 채팅 분석</Text>
        </View>

        <View style={[styles.cardBody, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.bodyTextMain, { color: theme.text }]}>
            {isLogin ? '다시 만나서 반가워요' : '새 계정을 만들어볼까요?'}
          </Text>
          <Text style={[styles.bodyTextSub, { color: theme.subText }]}>
            {isLogin
              ? '로그인 후 대화 분석을 시작하세요.'
              : '간단한 정보만 입력하면 바로 시작할 수 있어요.'}
          </Text>

          {!isLogin && (
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.inputText }]}
              placeholder="이름"
              placeholderTextColor={theme.placeholder}
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.inputText }]}
            placeholder="이메일"
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.inputText }]}
            placeholder="비밀번호"
            placeholderTextColor={theme.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.actionButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>
                {isLogin ? '로그인' : '회원가입'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(prev => !prev)}
            disabled={isSubmitting}
          >
            <Text style={[styles.toggleButtonText, { color: theme.subText }]}>
              {isLogin ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 34,
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    elevation: 5,
  },
  logoIcon: { fontSize: 24, fontWeight: '900', color: '#7C3AED' },
  headerTitle: { fontSize: 26, fontWeight: '900' },
  cardBody: {
    width: Math.min(width - 48, 420),
    alignSelf: 'center',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    elevation: 5,
  },
  bodyTextMain: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  bodyTextSub: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 26,
  },
  textInput: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  actionButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: { opacity: 0.7 },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  toggleButton: {
    alignItems: 'center',
    paddingTop: 18,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default Loginpage;
