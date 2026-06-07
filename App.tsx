import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './src/screens/StartScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import InputScreen, { AnalysisNames } from './src/screens/InputScreen';
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
  const AUTH_STORAGE_KEY = 'kproject.authUser';

  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [selectedCategory, setSelectedCategory] = useState('썸');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [archiveItems, setArchiveItems] = useState<ReportListItem[]>([]);
  const [trashItems, setTrashItems] = useState<ReportListItem[]>([]);
  const [isMypageOpen, setIsMypageOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<AuthUser | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const refreshReports = useCallback(
    async () => {
      const [reports, trash] = await Promise.all([
        backendApi.listReports(),
        backendApi.listTrash(),
      ]);
      setArchiveItems(reports);
      setTrashItems(trash);
    },
    [],
  );

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedUser) {
          return;
        }
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        if (!parsedUser?.memberId || !parsedUser?.email) {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          return;
        }
        setUserInfo(parsedUser);
        backendApi.setAuthToken(parsedUser.token);
        setCurrentScreen('START');
        await refreshReports();
      } catch (error) {
        console.warn('Failed to restore login session:', error);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsRestoringSession(false);
      }
    };

    restoreSession();
  }, [refreshReports]);

  const handleLoginSuccess = async (user: AuthUser) => {
    setUserInfo(user);
    backendApi.setAuthToken(user.token);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setCurrentScreen('START');
    try {
      await refreshReports();
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
    backendApi.setAuthToken(undefined);
    AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(error => {
      console.warn('Failed to clear login session:', error);
    });
    setCurrentScreen('LOGIN');
  };

  const userMessage = (error: any, fallback: string) => {
    const message = String(error?.message || '');
    if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
      return '로그인 정보가 만료됐거나 인증이 필요합니다. 다시 로그인해주세요.';
    }
    if (message.includes('403') || message.toLowerCase().includes('denied')) {
      return '이 리포트에 접근할 권한이 없습니다.';
    }
    if (message.includes('Failed to fetch') || message.includes('Network')) {
      return '서버에 연결하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.';
    }
    if (message.includes('업로드') || message.includes('file') || message.includes('파일')) {
      return '파일을 분석할 수 없습니다. txt, png, jpg, jpeg, webp 형식인지 확인해주세요.';
    }
    return message || fallback;
  };

  const runAnalysis = async (
    items: AttachedItem[],
    description: string,
    names?: AnalysisNames,
  ) => {
    setCurrentScreen('ANALYZING');

    try {
      const upload = await backendApi.uploadChat({
        items,
        category: selectedCategory,
        description,
        myName: names?.myName,
        targetName: names?.targetName,
      });
      const result = await backendApi.getAppResult(upload.reportId);
      setAnalysisResult(result);
      await refreshReports();
      setCurrentScreen('RESULT');
    } catch (error: any) {
      Alert.alert('분석 실패', userMessage(error, '파일 분석 중 오류가 발생했습니다.'));
      setCurrentScreen('INPUT');
    }
  };

  const handleArchiveDelete = async (reportId: number) => {
    try {
      await backendApi.moveToTrash(reportId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('이동 실패', userMessage(error, '휴지통으로 이동하지 못했습니다.'));
    }
  };

  const handleRestoreTrashItem = async (item: ReportListItem) => {
    try {
      await backendApi.restoreReport(item.reportId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('복구 실패', userMessage(error, '리포트를 복구하지 못했습니다.'));
    }
  };

  const handleDeleteTrashItem = async (reportId: number) => {
    try {
      await backendApi.deleteReport(reportId);
      await refreshReports();
    } catch (error: any) {
      Alert.alert('삭제 실패', userMessage(error, '리포트를 삭제하지 못했습니다.'));
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await backendApi.emptyTrash();
      await refreshReports();
    } catch (error: any) {
      Alert.alert('비우기 실패', userMessage(error, '휴지통을 비우지 못했습니다.'));
    }
  };

  const handleSelectArchive = async (item: ReportListItem) => {
    try {
      const result = await backendApi.getAppResult(item.reportId);
      setAnalysisResult(result);
      setCurrentScreen('RESULT');
    } catch (error: any) {
      Alert.alert('조회 실패', userMessage(error, '리포트를 불러오지 못했습니다.'));
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

  if (isRestoringSession) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer, { backgroundColor: isDarkMode ? '#111827' : '#F8F9FE' }]}>
        <ActivityIndicator color="#8B5CF6" />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#E5E7EB' : '#64748B' }]}>로그인 상태 확인 중</Text>
      </SafeAreaView>
    );
  }

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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default App;
