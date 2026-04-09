import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

type Screen = 'START' | 'CATEGORY' | 'INPUT' | 'ANALYZING' | 'RESULT';

import StartScreen from './src/screens/StartScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import InputScreen from './src/screens/InputScreen';
import AnalyzingScreen from './src/screens/AnalyzingScreen';
import ResultScreen from './src/screens/ResultScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('START');
  const [category, setCategory] = useState('');
  const [chatText, setChatText] = useState('');
  const [resultScore, setResultScore] = useState(0);

  const startAnalysis = () => setCurrentScreen('CATEGORY');
  const goToInput = (selectedCategory: string) => {
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
    setChatText('');
    setCategory('');
    setCurrentScreen('START');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'START':
        return <StartScreen onStart={startAnalysis} />;
      case 'CATEGORY':
        return (
          <CategoryScreen
            onBack={() => setCurrentScreen('START')}
            onNext={goToInput}
          />
        );
      case 'INPUT':
        return (
          <InputScreen
            chatText={chatText}
            setChatText={setChatText}
            onBack={() => setCurrentScreen('CATEGORY')}
            onAnalyze={runAnalysis}
          />
        );
      case 'ANALYZING':
        return <AnalyzingScreen />;
      case 'RESULT':
        return <ResultScreen resultScore={resultScore} onReset={reset} />;
      default:
        return <StartScreen onStart={startAnalysis} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, (currentScreen === 'START' || currentScreen === 'CATEGORY') && { backgroundColor: '#E6E6FA' }]}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
