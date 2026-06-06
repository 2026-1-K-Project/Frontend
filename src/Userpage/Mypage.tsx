import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface MypageProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userInfo?: {
    name: string;
    email: string;
    profileImage?: string;
  };
  onLoginPress: () => void;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  isDarkMode: boolean;
}

const Mypage: React.FC<MypageProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  userInfo,
  onLoginPress,
  onLogout,
  onNavigate,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const theme = {
    drawer: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#F3F4F6',
    title: isDarkMode ? '#F9FAFB' : '#1F2937',
    text: isDarkMode ? '#E5E7EB' : '#4B5563',
    subText: isDarkMode ? '#9CA3AF' : '#6B7280',
    profileBg: isDarkMode ? '#312E81' : '#DDD6FE',
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backDrop} activeOpacity={1} onPress={onClose} />

      <View style={[styles.drawerContainer, { backgroundColor: theme.drawer }]}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <View style={[styles.profileSection, { borderBottomColor: theme.border }]}>
            <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.profileBg }]}>
              <Text style={styles.profileInitial}>
                {isLoggedIn && userInfo ? userInfo.name.slice(0, 1) : '?'}
              </Text>
            </View>

            {isLoggedIn && userInfo ? (
              <>
                <Text style={[styles.userName, { color: theme.title }]}>{userInfo.name}</Text>
                <Text style={[styles.userEmail, { color: theme.subText }]}>{userInfo.email}</Text>
              </>
            ) : (
              <>
                <Text style={[styles.userName, { color: theme.title }]}>로그인이 필요합니다</Text>
                <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
                  <Text style={styles.loginButtonText}>로그인 / 회원가입</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.menuList}>
            <MenuItem label="보관함" onPress={() => onNavigate('ARCHIVE')} color={theme.text} />
            <MenuItem label="휴지통" onPress={() => onNavigate('TRASH')} color={theme.text} />
            <MenuItem label="설정" onPress={() => onNavigate('SETTINGS')} color={theme.text} />
          </View>

          {isLoggedIn && (
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};

const MenuItem = ({
  label,
  onPress,
  color,
}: {
  label: string;
  onPress: () => void;
  color: string;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={[styles.menuItemText, { color }]}>{label}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    flexDirection: 'row',
  },
  backDrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerContainer: {
    width: width * 0.75,
    height: '100%',
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    paddingHorizontal: 20,
    elevation: 10,
  },
  safeArea: { flex: 1 },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 10,
  },
  closeText: {
    fontSize: 34,
    color: '#7C3AED',
    fontWeight: '300',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 24,
    paddingBottom: 28,
    borderBottomWidth: 1,
  },
  profileImagePlaceholder: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  profileInitial: {
    fontSize: 30,
    color: '#7C3AED',
    fontWeight: '900',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 5,
  },
  userEmail: { fontSize: 14, fontWeight: '600' },
  loginButton: {
    marginTop: 14,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  menuList: { flex: 1, marginTop: 12 },
  menuItem: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '800',
  },
  menuArrow: {
    fontSize: 24,
    color: '#A78BFA',
    fontWeight: '700',
  },
  logoutButton: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default Mypage;
