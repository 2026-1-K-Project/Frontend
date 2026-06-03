import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LoginpageProps {
  onLogin: () => void;
  isDarkMode: boolean;
}

const Loginpage: React.FC<LoginpageProps> = ({ onLogin, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showLoginFailModal, setShowLoginFailModal] = useState(false);
  const [showEmptyModal, setShowEmptyModal] = useState(false);

  const [registeredUsers] = useState([
    { email: 'test@example.com', password: 'password123' },
  ]);

  const theme = {
    background: isDarkMode ? '#111827' : '#F5F3FF',
    title: isDarkMode ? '#F9FAFB' : '#6D28D9',
    mainText: isDarkMode ? '#F5F3FF' : '#312E81',
    subText: isDarkMode ? '#C4B5FD' : '#7C3AED',
    card: isDarkMode ? 'rgba(31, 41, 55, 0.92)' : 'rgba(255, 255, 255, 0.88)',
    inputBg: isDarkMode ? '#1F2937' : '#FFFFFF',
    inputText: isDarkMode ? '#F9FAFB' : '#1F2937',
    border: isDarkMode ? '#4B5563' : '#E9D5FF',
    placeholder: isDarkMode ? '#9CA3AF' : '#A78BFA',
    toggle: isDarkMode ? '#DDD6FE' : '#7C3AED',
    wave1: isDarkMode ? '#312E81' : '#EDE9FE',
    wave2: isDarkMode ? '#4C1D95' : '#DDD6FE',
    wave3: isDarkMode ? '#6D28D9' : '#C4B5FD',
    indicator: isDarkMode ? '#C4B5FD' : '#8B5CF6',
  };

  const handleSubmit = () => {
    if (isLogin) {
      const user = registeredUsers.find(
        u => u.email === email && u.password === password,
      );

      if (user) {
        console.log('Login success:', email);
        onLogin();
      } else {
        setShowLoginFailModal(true);
      }
    } else {
      if (!email || !password || !name) {
        setShowEmptyModal(true);
        return;
      }

      console.log('Sign up success:', name, email);
      onLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🔮</Text>
          </View>

          <Text style={[styles.headerTitle, { color: theme.title }]}>
            AI 채팅 분석
          </Text>
        </View>

        <View style={[styles.cardBody, { backgroundColor: theme.card }]}>
          <View style={styles.textGroup}>
            <Text style={[styles.bodyTextMain, { color: theme.mainText }]}>
              {isLogin
                ? '반가워요!\n다시 오셨군요'
                : '환영합니다!\n계정을 만들어보세요'}
            </Text>

            <Text style={[styles.bodyTextSub, { color: theme.subText }]}>
              {isLogin
                ? '로그인 후 채팅 분석을 시작해보세요'
                : '간단한 정보 입력 후 바로 시작할 수 있어요'}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            {!isLogin && (
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={[styles.textInput, { color: theme.inputText }]}
                  placeholder="이름"
                  placeholderTextColor={theme.placeholder}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={[styles.textInput, { color: theme.inputText }]}
                placeholder="이메일"
                placeholderTextColor={theme.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.textInput, { color: theme.inputText }]}
                placeholder="비밀번호"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonText}>
              {isLogin ? '로그인' : '회원가입'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
            activeOpacity={0.75}
          >
            <Text style={[styles.toggleButtonText, { color: theme.toggle }]}>
              {isLogin
                ? '아직 계정이 없나요? 회원가입'
                : '이미 계정이 있으신가요? 로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.waveLayerContainer} pointerEvents="none">
          <View style={[styles.waveCircle, styles.wave1, { backgroundColor: theme.wave1 }]} />
          <View style={[styles.waveCircle, styles.wave2, { backgroundColor: theme.wave2 }]} />
          <View style={[styles.waveCircle, styles.wave3, { backgroundColor: theme.wave3 }]} />

          <Text style={styles.sparkle1}>✦</Text>
          <Text style={styles.sparkle2}>✦</Text>
          <Text style={styles.sparkle3}>✦</Text>
          <Text style={styles.sparkle4}>✧</Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.homeIndicatorLine,
          { backgroundColor: theme.indicator },
        ]}
        pointerEvents="none"
      />

      <Modal
        visible={showLoginFailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginFailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.failModalCard,
              { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' },
            ]}
          >
            <View style={styles.failIconCircle}>
              <Text style={styles.failIcon}>!</Text>
            </View>

            <Text style={[styles.failTitle, { color: theme.mainText }]}>
              로그인 실패
            </Text>

            <Text style={[styles.failMessage, { color: theme.subText }]}>
              회원 정보가 없습니다.{'\n'}회원가입 후 이용해주세요.
            </Text>

            <TouchableOpacity
              style={styles.failPrimaryButton}
              onPress={() => {
                setShowLoginFailModal(false);
                setIsLogin(false);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.failPrimaryButtonText}>
                회원가입 하러가기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.failCancelButton}
              onPress={() => setShowLoginFailModal(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.failCancelButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showEmptyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmptyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.failModalCard,
              { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' },
            ]}
          >
            <View style={styles.failIconCircle}>
              <Text style={styles.failIcon}>!</Text>
            </View>

            <Text style={[styles.failTitle, { color: theme.mainText }]}>
              입력 필요
            </Text>

            <Text style={[styles.failMessage, { color: theme.subText }]}>
              회원가입을 위해{'\n'}모든 정보를 입력해주세요.
            </Text>

            <TouchableOpacity
              style={styles.failPrimaryButton}
              onPress={() => setShowEmptyModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.failPrimaryButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  header: {
    paddingTop: 58,
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 28,
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  logoIcon: { fontSize: 36 },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  cardBody: {
    marginHorizontal: 24,
    marginTop: 38,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 28,
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bodyTextMain: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 39,
    letterSpacing: -0.7,
  },
  bodyTextSub: {
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputWrapper: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    borderWidth: 1.3,
    marginBottom: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '600',
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 18,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  waveLayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
    zIndex: 1,
  },
  waveCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
  },
  wave1: {
    bottom: -width * 1.32,
    left: -width * 0.45,
    opacity: 0.52,
  },
  wave2: {
    bottom: -width * 1.48,
    left: -width * 0.7,
    opacity: 0.58,
  },
  wave3: {
    bottom: -width * 1.58,
    left: -width * 0.18,
    opacity: 0.74,
  },
  sparkle1: {
    position: 'absolute',
    bottom: '66%',
    left: '18%',
    color: '#FFF',
    fontSize: 22,
    opacity: 0.85,
  },
  sparkle2: {
    position: 'absolute',
    bottom: '82%',
    left: '42%',
    color: '#FFF',
    fontSize: 14,
    opacity: 0.65,
  },
  sparkle3: {
    position: 'absolute',
    bottom: '55%',
    right: '24%',
    color: '#FFF',
    fontSize: 26,
    opacity: 0.82,
  },
  sparkle4: {
    position: 'absolute',
    bottom: '74%',
    right: '13%',
    color: '#FFF',
    fontSize: 18,
    opacity: 0.55,
  },
  homeIndicatorLine: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 140,
    height: 5,
    borderRadius: 10,
    opacity: 0.28,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 75, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  failModalCard: {
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
  failIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  failIcon: {
    fontSize: 32,
    color: '#8B5CF6',
    fontWeight: '900',
  },
  failTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  failMessage: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  failPrimaryButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  failPrimaryButtonText: {
    color: '#FFF',
    fontSize: 15.5,
    fontWeight: '900',
  },
  failCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  failCancelButtonText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default Loginpage;