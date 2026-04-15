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
} from 'react-native';

const { width } = Dimensions.get('window');

interface LoginpageProps {
  onLogin: () => void;
}

const Loginpage: React.FC<LoginpageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // 가상의 회원 데이터베이스 (테스트용)
  const [registeredUsers] = useState([
    { email: 'test@example.com', password: 'password123' }
  ]);

  const handleSubmit = () => {
    if (isLogin) {
      // 로그인 시도
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        console.log('Login success:', email);
        onLogin();
      } else {
        // 회원이 아니거나 정보가 틀린 경우 알림창 띄우기
        Alert.alert(
          '로그인 실패',
          '회원 정보가 없습니다. 회원가입을 해주세요.',
          [
            { 
              text: '회원가입 하러 가기',
              onPress: () => setIsLogin(false) 
            },
            { 
              text: '확인', 
              style: 'cancel' 
            }
          ]
        );
      }
    } else {
      // 회원가입 시도
      if (!email || !password || !name) {
        Alert.alert('알림', '모든 정보를 입력해주세요!');
        return;
      }
      console.log('Sign up success:', name, email);
      // 가상으로 회원가입 완료 후 로그인 처리
      onLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI 채팅 분석</Text>
        </View>

        {/* Body Content */}
        <View style={styles.cardBody}>
          <View style={styles.textGroup}>
            <Text style={styles.bodyTextMain}>
              {isLogin ? '반가워요!\n다시 오셨군요' : '환영합니다!\n계정을 만들어보세요'}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            {!isLogin && (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="이름"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="이메일"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="비밀번호"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleSubmit}>
            <Text style={styles.actionButtonText}>
              {isLogin ? '로그인' : '회원가입'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.toggleButtonText}>
              {isLogin
                ? '계정이 없으신가요? 회원가입'
                : '이미 계정이 있으신가요? 로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Decorative Waves */}
        <View style={styles.waveLayerContainer} pointerEvents="none">
          <View style={[styles.waveCircle, styles.wave1]} />
          <View style={[styles.waveCircle, styles.wave2]} />
          <View style={[styles.waveCircle, styles.wave3]} />
          <Text style={styles.sparkle1}>✦</Text>
          <Text style={styles.sparkle2}>✦</Text>
          <Text style={styles.sparkle3}>✦</Text>
        </View>
      </ScrollView>

      {/* Bottom Home Indicator Area Decoration */}
      <View style={styles.homeIndicatorLine} pointerEvents="none" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C3AED',
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    zIndex: 10,
    marginTop: 40,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bodyTextMain: {
    fontSize: 26,
    fontWeight: '600',
    color: '#4338CA',
    textAlign: 'center',
    lineHeight: 38,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    marginBottom: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  toggleButton: {
    padding: 10,
  },
  toggleButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
    zIndex: 10,
  },
});

export default Loginpage;
