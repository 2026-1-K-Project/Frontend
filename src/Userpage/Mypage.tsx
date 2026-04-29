import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
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
}

const Mypage: React.FC<MypageProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  userInfo,
  onLoginPress,
  onLogout,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backDrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.drawerContainer}>
        <SafeAreaView style={styles.safeArea}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>

          {/* User Profile Section */}
          <View style={styles.profileSection}>
            {isLoggedIn && userInfo ? (
              <>
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileInitial}>{userInfo.name[0]}</Text>
                </View>
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userEmail}>{userInfo.email}</Text>
              </>
            ) : (
              <>
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileInitial}>?</Text>
                </View>
                <Text style={styles.userName}>로그인이 필요합니다</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={onLoginPress}>
                  <Text style={styles.loginBtnText}>로그인 / 회원가입</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Menu List */}
          <View style={styles.menuList}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                onNavigate('ARCHIVE');
                onClose();
              }}
            >
              <Text style={styles.menuItemIcon}>📦</Text>
              <Text style={styles.menuItemText}>보관함</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                onNavigate('TRASH');
                onClose();
              }}
            >
              <Text style={styles.menuItemIcon}>🗑️</Text>
              <Text style={styles.menuItemText}>휴지통</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                onNavigate('SETTINGS');
                onClose();
              }}
            >
              <Text style={styles.menuItemIcon}>⚙️</Text>
              <Text style={styles.menuItemText}>설정</Text>
            </TouchableOpacity>
          </View>

          {/* Footer / Logout */}
          {isLoggedIn && (
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};

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
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 10,
  },
  closeIcon: {
    fontSize: 36,
    color: '#7C3AED',
    fontWeight: '300',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DDD6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 32,
    color: '#7C3AED',
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginBtn: {
    marginTop: 15,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  menuList: {
    flex: 1,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 12,
  },
  menuItemIcon: {
    fontSize: 22,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4B5563',
  },
  logoutBtn: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Mypage;
