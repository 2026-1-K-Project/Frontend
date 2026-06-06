import React, { useCallback, useState } from 'react';
import {
  Alert,
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
import { backendApi } from './src/api/backend';
import { AnalysisData } from './src/types/Analysis';
import { AttachedItem, AuthUser, ReportListItem } from './src/types/Api';

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
  const [selectedCategory, setSelectedCategory] = useState('썸');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [archiveItems, setArchiveItems] = useState<ReportListItem[]>([]);
  const [trashItems, setTrashItems] = useState<ReportListItem[]>([]);
  const [isMypageOpen, setIsMypageOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<AuthUser | null>(null);

  const refreshReports = useCallback(
    async (memberId = userInfo?.memberId) => {
      const [reports, trash] = await Promise.all([
        backendApi.listReports(memberId),
        backendApi.listTrash(memberId),
      ]);
      setArchiveItems(reports);
      setTrashItems(trash);
    },
    [userInfo?.memberId],
  );

  const handleLoginSuccess = async (user: AuthUser) => {
    setUserInfo(user);
    setCurrentScreen('START');
    try {
      await refreshReports(user.memberId);
    } catch (error) {
      console.warn('Failed to load reports:', error);
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    setArchiveItems([]);
    setTrashItems([]);
    setAnalysisResult(null);
    setIsMypageOpen(false);
    setCurrentScreen('LOGIN');
  };

  const runAnalysis = async (items: AttachedItem[], description: string) => {
    setCurrentScreen('ANALYZING');

    try {
      const upload = await backendApi.uploadChat({
        items,
        category: selectedCategory,
        memberId: userInfo?.memberId,
        description,
      });
      const result = await backendApi.getAppResult(upload.reportId);
      setAnalysisResult(result);
      await refreshReports(userInfo?.memberId);
      setCurrentScreen('RESULT');
    } catch (error: any) {
      Alert.alert('분석 실패', error?.message || '파일 분석 중 오류가 발생했습니다.');
      setCurrentScreen('INPUT');
    }
  };

  const handleArchiveDelete = async (reportId: number) => {
    try {
      await backendApi.moveToTrash(reportId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('이동 실패', error?.message || '휴지통으로 이동하지 못했습니다.');
    }
  };

  const handleRestoreTrashItem = async (item: ReportListItem) => {
    try {
      await backendApi.restoreReport(item.reportId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('복구 실패', error?.message || '리포트를 복구하지 못했습니다.');
    }
  };

  const handleDeleteTrashItem = async (reportId: number) => {
    try {
      await backendApi.deleteReport(reportId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('삭제 실패', error?.message || '리포트를 삭제하지 못했습니다.');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await backendApi.emptyTrash(userInfo?.memberId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('비우기 실패', error?.message || '휴지통을 비우지 못했습니다.');
    }
  };

  const handleSelectArchive = async (item: ReportListItem) => {
    try {
      const result = await backendApi.getAppResult(item.reportId);
      setAnalysisResult(result);
      setCurrentScreen('RESULT');
    } catch (error: any) {
      Alert.alert('조회 실패', error?.message || '리포트를 불러오지 못했습니다.');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return <Loginpage onLogin={handleLoginSuccess} isDarkMode={isDarkMode} />;
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
            onNext={category => {
              setSelectedCategory(category);
              setCurrentScreen('INPUT');
            }}
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
            onSelectDetail={handleSelectArchive}
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
            onEmptyTrash={handleEmptyTrash}
            isDarkMode={isDarkMode}
          />
        );
      default:
        return <Loginpage onLogin={handleLoginSuccess} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#111827' : '#F8F9FE' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {renderScreen()}
      </SafeAreaView>

      <Mypage
        isOpen={isMypageOpen}
        onClose={() => setIsMypageOpen(false)}
        isLoggedIn={!!userInfo}
        userInfo={userInfo || undefined}
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
  },
});

export default App;
