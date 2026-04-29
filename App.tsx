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
import ArchiveDetailScreen from './src/Userpage/ArchiveDetailScreen';
import TrashScreen from './src/Userpage/TrashScreen';

type Screen = 'START' | 'CATEGORY' | 'INPUT' | 'ANALYZING' | 'RESULT' | 'LOGIN' | 'ARCHIVE' | 'SETTINGS' | 'ARCHIVE_DETAIL' | 'TRASH';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [category, setCategory] = useState('');
  const [resultScore, setResultScore] = useState(0);
  const [selectedArchive, setSelectedArchive] = useState<any>(null);
  
  // 데이터 상태 관리
  const [archives, setArchives] = useState<any[]>([
    { 
      id: 1, 
      title: '전남친과의 대화', 
      date: '2023.10.25', 
      score: 85,
      description: '헤어진 지 3개월 된 전남친이 갑자기 선톡을 보냈어요. 어떤 마음인지 궁금해요.',
      analysisResult: '상대방은 현재 당신에 대해 긍정적인 추억을 회상하고 있는 것으로 보입니다. 대화의 흐름이 부드럽고 질문이 많은 것으로 보아 재회에 대한 가능성을 열어두고 접근하고 있습니다.'
    },
    { 
      id: 2, 
      title: '소개팅남 첫 대화', 
      date: '2023.11.02', 
      score: 42,
      description: '어제 소개팅한 분이랑 카톡을 시작했는데 답장이 좀 느린 것 같아요.',
      analysisResult: '아직은 서로를 알아가는 단계라 조심스러운 모습입니다. 호감도 점수가 낮은 이유는 상대방의 답변이 단답형에 가깝고 질문의 빈도가 적기 때문입니다. 조금 더 공통 관심사를 찾아보는 것을 추천합니다.'
    },
    { 
      id: 3, 
      title: '회사 동료 분석', 
      date: '2023.11.15', 
      score: 67,
      description: '업무 외적으로도 연락이 자주 오는데, 이게 단순히 친절인지 호감인지 헷갈려요.',
      analysisResult: '상대방은 당신에게 동료 이상의 호감을 느끼고 있을 확률이 높습니다. 이모티콘 사용이 잦고 업무 시간 외에도 대화를 이어가려는 노력이 보입니다. 개인적인 약속을 제안할 타이밍으로 보입니다.'
    },
  ]);
  const [trashItems, setTrashItems] = useState<any[]>([]);

  // 마이페이지 상태 및 로그인 정보
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

  // 보관함 -> 휴지통 이동
  const handleDeleteToTrash = (id: number) => {
    const itemToDelete = archives.find(a => a.id === id);
    if (itemToDelete) {
      setArchives(archives.filter(a => a.id !== id));
      setTrashItems([...trashItems, itemToDelete]);
    }
  };

  // 휴지통 -> 보관함 복원
  const handleRestore = (item: any) => {
    setTrashItems(trashItems.filter(t => t.id !== item.id));
    setArchives([...archives, item]);
  };

  // 영구 삭제
  const handleDeletePermanently = (id: number) => {
    setTrashItems(trashItems.filter(t => t.id !== id));
  };

  const handleEmptyTrash = () => {
    setTrashItems([]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return <Loginpage onLogin={handleLoginSuccess} />;
      case 'START':
        return <StartScreen onStart={() => setCurrentScreen('CATEGORY')} onOpenMypage={() => setIsMypageOpen(true)} />;
      case 'CATEGORY':
        return <CategoryScreen onBack={() => setCurrentScreen('START')} onNext={(cat) => { setCategory(cat); setCurrentScreen('INPUT'); }} />;
      case 'INPUT':
        return <InputScreen onBack={() => setCurrentScreen('CATEGORY')} onAnalyze={() => {
          setCurrentScreen('ANALYZING');
          setTimeout(() => {
            setResultScore(Math.floor(Math.random() * 100));
            setCurrentScreen('RESULT');
          }, 2000);
        }} />;
      case 'ANALYZING':
        return <AnalyzingScreen />;
      case 'RESULT':
        return <ResultScreen resultScore={resultScore} onReset={() => setCurrentScreen('START')} />;
      case 'ARCHIVE':
        return (
          <ArchiveScreen 
            onBack={() => setCurrentScreen('START')} 
            archives={archives}
            onDelete={handleDeleteToTrash}
            onSelectDetail={(archive) => {
              setSelectedArchive(archive);
              setCurrentScreen('ARCHIVE_DETAIL');
            }}
          />
        );
      case 'ARCHIVE_DETAIL':
        return (
          <ArchiveDetailScreen 
            archiveData={selectedArchive} 
            onBack={() => setCurrentScreen('ARCHIVE')} 
          />
        );
      case 'TRASH':
        return (
          <TrashScreen 
            onBack={() => setCurrentScreen('START')}
            trashItems={trashItems}
            onRestore={handleRestore}
            onDeletePermanently={handleDeletePermanently}
            onEmptyTrash={handleEmptyTrash}
          />
        );
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
        (currentScreen === 'START' || currentScreen === 'CATEGORY' || currentScreen === 'LOGIN' || currentScreen === 'ARCHIVE' || currentScreen === 'SETTINGS' || currentScreen === 'ARCHIVE_DETAIL' || currentScreen === 'TRASH') && { backgroundColor: '#E6E6FA' }
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
          if (screen === 'TRASH') setCurrentScreen('TRASH');
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
