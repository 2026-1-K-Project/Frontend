/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF2F0" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 30 }} /> {/* Layout balance */}
        <Text style={styles.headerTitle}>
          <Text style={{ fontWeight: 'bold' }}>AI</Text> 채팅 분석
        </Text>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuIconLine} />
          <View style={styles.menuIconLine} />
          <View style={styles.menuIconLine} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          대화를 분석해{'\n'}상대의 마음을 알아보세요!
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>분석 시작하기</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Star */}
      <View style={styles.footer}>
        <Text style={styles.starIcon}>★</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F0', // Light pink background
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: '#333',
  },
  menuButton: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuIconLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  description: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 34,
    color: '#000',
    fontWeight: '600',
    marginBottom: 60,
  },
  button: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 35,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 30,
    color: '#000',
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  starIcon: {
    fontSize: 250,
    color: '#C0716B', // Star color from image
  },
});

export default App;
