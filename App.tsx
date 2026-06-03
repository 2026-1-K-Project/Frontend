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
import TrashScreen from './src/Userpage/TrashScreen';
import { AnalysisData } from './src/types/Analysis';

type Screen =
  | 'START'
  | 'CATEGORY'
  | 'INPUT'
  | 'ANALYZING'
  | 'RESULT'
  | 'LOGIN'
  | 'ARCHIVE'
  | 'SETTINGS'
  | 'TRASH';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(
    null,
  );

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [archiveItems, setArchiveItems] = useState<any[]>([]);
  const [trashItems, setTrashItems] = useState<any[]>([]);

  const [isMypageOpen, setIsMypageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<
    { name: string; email: string } | undefined
  >(undefined);

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

  const runAnalysis = (items: any[], description: string) => {
    setCurrentScreen('ANALYZING');

    setTimeout(() => {
      const mockData: AnalysisData = {
        resultScore: 95,
        shareMe: 45,
        sharePartner: 55,
        replyTime: '12분',
        syncIndex: 88,
        keywords: ['오늘뭐해', '보고싶다', '웃겨', '카페', '내일'],
        mbti: 'ENFP',
        attachment: '안정형',
        bigFive: {
          extraversion: 80,
          agreeableness: 85,
          conscientiousness: 60,
          openness: 90,
          neuroticism: 30,
        },
        moment:
          '내일 우리 같이 영화 볼래? 라고 물었을 때 호감도가 급상승했습니다.',
        tips: "상대방의 관심사인 '여행' 주제를 더 깊게 파보세요.",
        warning: '단답형 대답은 상대방을 위축되게 할 수 있습니다.',
      };

      const archiveItem = {
        id: Date.now(),
        title: 'AI 채팅 분석 결과',
        date: new Date().toLocaleDateString(),
        score: mockData.resultScore,
        data: mockData,
      };

      setAnalysisResult(mockData);
      setArchiveItems(prev => [archiveItem, ...prev]);
      setCurrentScreen('RESULT');
    }, 3000);
  };

  const handleArchiveDelete = (id: number) => {
    const target = archiveItems.find(item => item.id === id);

    if (target) {
      setTrashItems(prev => [target, ...prev]);
    }

    setArchiveItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRestoreTrashItem = (item: any) => {
    setTrashItems(prev => prev.filter(i => i.id !== item.id));
    setArchiveItems(prev => [item, ...prev]);
  };

  const handleDeleteTrashItem = (id: number) => {
    setTrashItems(prev => prev.filter(i => i.id !== id));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return (
          <Loginpage
            onLogin={handleLoginSuccess}
            isDarkMode={isDarkMode}
          />
        );

      case 'START':
        return (
          <StartScreen
            onStart={() => setCurrentScreen('CATEGORY')}
            onOpenMypage={() => setIsMypageOpen(true)}
            isDarkMode={isDarkMode}
          />
        );

      case 'CATEGORY':
        return (
          <CategoryScreen
            onBack={() => setCurrentScreen('START')}
            onNext={() => setCurrentScreen('INPUT')}
            isDarkMode={isDarkMode}
          />
        );

      case 'INPUT':
        return (
          <InputScreen
            onBack={() => setCurrentScreen('CATEGORY')}
            onAnalyze={runAnalysis}
            isDarkMode={isDarkMode}
          />
        );

      case 'ANALYZING':
        return <AnalyzingScreen isDarkMode={isDarkMode} />;

      case 'RESULT':
        return (
            <ResultScreen
              resultData={analysisResult}
              onReset={() => setCurrentScreen('START')}
              isDarkMode={isDarkMode}
              onMyPagePress={() => setIsMypageOpen(true)}
            />
        );

      case 'ARCHIVE':
        return (
          <ArchiveScreen
            onBack={() => setCurrentScreen('START')}
            archives={archiveItems}
            onDelete={handleArchiveDelete}
            onSelectDetail={item => {
              if (item.data) {
                setAnalysisResult(item.data);
                setCurrentScreen('RESULT');
              }
            }}
            isDarkMode={isDarkMode}
          />
        );

      case 'SETTINGS':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen('START')}
            isDarkMode={isDarkMode}
            onChangeDarkMode={setIsDarkMode}
          />
        );

      case 'TRASH':
        return (
          <TrashScreen
            onBack={() => setCurrentScreen('START')}
            trashItems={trashItems}
            onRestore={handleRestoreTrashItem}
            onDeletePermanently={handleDeleteTrashItem}
            onEmptyTrash={() => setTrashItems([])}
            isDarkMode={isDarkMode}
          />
        );

      default:
        return (
          <Loginpage
            onLogin={handleLoginSuccess}
            isDarkMode={isDarkMode}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
          },
          !isDarkMode &&
            (currentScreen === 'START' ||
              currentScreen === 'CATEGORY' ||
              currentScreen === 'LOGIN' ||
              currentScreen === 'ARCHIVE' ||
              currentScreen === 'SETTINGS' ||
              currentScreen === 'TRASH') && {
              backgroundColor: '#E6E6FA',
            },
        ]}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
        onNavigate={screen => {
          setIsMypageOpen(false);

          if (screen === 'ARCHIVE') setCurrentScreen('ARCHIVE');
          if (screen === 'SETTINGS') setCurrentScreen('SETTINGS');
          if (screen === 'TRASH') setCurrentScreen('TRASH');
        }}
        isDarkMode={isDarkMode}
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