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

type Screen = 'START' | 'CATEGORY' | 'INPUT' | 'ANALYZING' | 'RESULT' | 'LOGIN' | 'ARCHIVE' | 'SETTINGS';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [category, setCategory] = useState('');
  const [resultScore, setResultScore] = useState(0);
  
  // 마이페이지 드라이버 상태 및 로그인 정보
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

  const runAnalysis = () => {
    setCurrentScreen('ANALYZING');
    setTimeout(() => {
      const scores = [35, 62, 95];
      setResultScore(scores[Math.floor(Math.random() * scores.length)]);
      setCurrentScreen('RESULT');
    }, 2500);
  };

  const reset = () => {
    setCategory('');
    setCurrentScreen('START');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return <Loginpage onLogin={handleLoginSuccess} />;
      case 'START':
        return <StartScreen onStart={startAnalysis} onOpenMypage={() => setIsMypageOpen(true)} />;
      case 'CATEGORY':
        return <CategoryScreen onBack={() => setCurrentScreen('START')} onNext={selectCategory} />;
      case 'INPUT':
        return <InputScreen onBack={() => setCurrentScreen('CATEGORY')} onAnalyze={runAnalysis} />;
      case 'ANALYZING':
        return <AnalyzingScreen />;
      case 'RESULT':
        return <ResultScreen resultScore={resultScore} onReset={reset} />;
      case 'ARCHIVE':
        return <ArchiveScreen onBack={() => setCurrentScreen('START')} />;
      case 'SETTINGS':
        return <SettingsScreen onBack={() => setCurrentScreen('START')} />;
      default:
        return <Loginpage onLogin={handleLoginSuccess} />;
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
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
