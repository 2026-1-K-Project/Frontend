import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';

import StartScreen from './src/screens/StartScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import InputScreen from './src/screens/InputScreen';
import AnalyzingScreen from './src/screens/AnalyzingScreen';
import ResultScreen from './src/screens/ResultScreen';
import Loginpage from './src/Userpage/Loginpage';
import Mypage from './src/Userpage/Mypage';
import ArchiveScreen from './src/Userpage/ArchiveScreen';
import SettingsScreen from './src/Userpage/SettingsScreen';
import { AnalysisData } from './src/types/Analysis';

type Screen = 'START' | 'CATEGORY' | 'INPUT' | 'ANALYZING' | 'RESULT' | 'LOGIN' | 'ARCHIVE' | 'SETTINGS';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [category, setCategory] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  
  const [isMypageOpen, setIsMypageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | undefined>(undefined);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserInfo({ name: '사용자', email: 'user@example.com' });
    setCurrentScreen('START');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(undefined);
    setIsMypageOpen(false);
    setCurrentScreen('LOGIN');
  };

  const startAnalysis = () => setCurrentScreen('CATEGORY');

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setCurrentScreen('INPUT');
  };

  const runAnalysis = (imageUri: string, description: string) => {
    setCurrentScreen('ANALYZING');

    // 시연용 데이터 생성 및 화면 전환 로직
    setTimeout(() => {
      const mockData: AnalysisData = {
        resultScore: 95,
        shareMe: 45,
        sharePartner: 55,
        replyTime: "12분",
        syncIndex: 88,
        keywords: ["오늘뭐해", "보고싶다", "웃겨", "카페", "내일"],
        mbti: "ENFP",
        attachment: "안정형",
        bigFive: {
          extraversion: 80,
          agreeableness: 85,
          conscientiousness: 60,
          openness: 90,
          neuroticism: 30
        },
        moment: "내일 우리 같이 영화 볼래? 라고 물었을 때 호감도가 급상승했습니다.",
        tips: "상대방의 관심사인 '여행' 주제를 더 깊게 파보세요.",
        warning: "단답형 대답은 상대방을 위축되게 할 수 있습니다."
      };

      setAnalysisResult(mockData);
      // 데이터가 세팅된 후 결과 화면으로 이동
      setCurrentScreen('RESULT');
    }, 3000);
  };

  const reset = () => {
    setCategory('');
    setAnalysisResult(null);
    setCurrentScreen('START');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN': return <Loginpage onLogin={handleLoginSuccess} />;
      case 'START': return <StartScreen onStart={startAnalysis} onOpenMypage={() => setIsMypageOpen(true)} />;
      case 'CATEGORY': return <CategoryScreen onBack={() => setCurrentScreen('START')} onNext={selectCategory} />;
      case 'INPUT': return <InputScreen onBack={() => setCurrentScreen('CATEGORY')} onAnalyze={runAnalysis} />;
      case 'ANALYZING': return <AnalyzingScreen />;
      case 'RESULT': return <ResultScreen resultData={analysisResult} onReset={reset} />;
      case 'ARCHIVE': return <ArchiveScreen onBack={() => setCurrentScreen('START')} />;
      case 'SETTINGS': return <SettingsScreen onBack={() => setCurrentScreen('START')} />;
      default: return <Loginpage onLogin={handleLoginSuccess} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[
        styles.safeArea, 
        (currentScreen === 'START' || currentScreen === 'CATEGORY' || currentScreen === 'LOGIN' || currentScreen === 'ARCHIVE' || currentScreen === 'SETTINGS') && { backgroundColor: '#E6E6FA' }
      ]}>
        <StatusBar barStyle="dark-content" />
        {renderScreen()}
      </SafeAreaView>

      <Mypage 
        isOpen={isMypageOpen} 
        onClose={() => setIsMypageOpen(false)}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        onLoginPress={() => {
          setIsMypageOpen(false);
          setCurrentScreen('LOGIN');
        }}
        onLogout={handleLogout}
        onNavigate={(screen) => {
          if (screen === 'ARCHIVE') setCurrentScreen('ARCHIVE');
          if (screen === 'SETTINGS') setCurrentScreen('SETTINGS');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
});

export default App;
