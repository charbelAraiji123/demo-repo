import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Constants/Header';
import FileStorage from '../assets/FileStorage';

const AdminDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await FileStorage.getUsers();
    setUsers(allUsers);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        },
      },
    ]);
  };

  const handleExportData = async () => {
    const result = await FileStorage.saveUsersToFile();
    if (result.success) {
      Alert.alert(
        'Export Successful',
        `${result.count} users exported!\n\nBackup ID: ${result.key}`
      );
    } else {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name || 'this user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await FileStorage.deleteUser(user.phoneNumber || user.phone);
            if (success) {
              Alert.alert('Success', 'User deleted successfully');
              loadUsers();
              setModalVisible(false);
            } else {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleClearAllUsers = () => {
    Alert.alert(
      'Clear All Users',
      'Are you sure you want to delete ALL users? This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            const success = await FileStorage.clearAllData();
            if (success) {
              Alert.alert('Success', 'All users deleted successfully');
              loadUsers();
            } else {
              Alert.alert('Error', 'Failed to clear users');
            }
          },
        },
      ]
    );
  };

  const UserCard = ({ user, onPress }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => onPress(user)}>
      <View style={styles.userHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name || 'No Name'}</Text>
          <Text style={styles.userPhone}>{user.phoneNumber || user.phone}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#888" />
      </View>
      <View style={styles.userStats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>${user.balance || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Email</Text>
          <Text style={styles.statValueSmall}>{user.email || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header text="" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Total Users: {users.length}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <Ionicons name="log-out" size={28} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#0A1F44" />
          <Text style={styles.actionText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <Ionicons name="download" size={24} color="#0A1F44" />
          <Text style={styles.actionText}>Export</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleClearAllUsers}>
          <Ionicons name="trash" size={24} color="#d32f2f" />
          <Text style={[styles.actionText, styles.dangerText]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {users.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          users.map((user, index) => (
            <UserCard key={index} user={user} onPress={handleUserPress} />
          ))
        )}
      </ScrollView>

      {/* User Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedUser && (
                <>
                  <DetailRow
                    icon="person"
                    label="Name"
                    value={selectedUser.name || 'N/A'}
                  />
                  <DetailRow
                    icon="call"
                    label="Phone"
                    value={selectedUser.phoneNumber || selectedUser.phone || 'N/A'}
                  />
                  <DetailRow
                    icon="mail"
                    label="Email"
                    value={selectedUser.email || 'N/A'}
                  />
                  <DetailRow
                    icon="wallet"
                    label="Balance"
                    value={`${selectedUser.balance || 0}`}
                  />
                  <DetailRow
                    icon="calendar"
                    label="Age"
                    value={selectedUser.age || 'N/A'}
                  />
                  <DetailRow
                    icon="male-female"
                    label="Gender"
                    value={selectedUser.gender || 'N/A'}
                  />
                  <DetailRow
                    icon="earth"
                    label="Country"
                    value={selectedUser.country || 'N/A'}
                  />
                  <DetailRow
                    icon="location"
                    label="Address"
                    value={selectedUser.address || 'N/A'}
                  />

                  {/* Delete User Button */}
                  <TouchableOpacity
                    style={styles.deleteUserButton}
                    onPress={() => handleDeleteUser(selectedUser)}
                  >
                    <Ionicons name="trash" size={20} color="#fff" />
                    <Text style={styles.deleteUserText}>Delete User</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <Ionicons name={icon} size={20} color="#0A1F44" />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9daddff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1F44',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  logoutIcon: {
    padding: 5,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A1F44',
    marginLeft: 8,
  },
  dangerText: {
    color: '#d32f2f',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A1F44',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1F44',
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00A8E8',
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1F44',
  },
  modalContent: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F44',
    marginLeft: 10,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    maxWidth: '50%',
    textAlign: 'right',
  },
  deleteUserButton: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  deleteUserText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AdminDashboard;