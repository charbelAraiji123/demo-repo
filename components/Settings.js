import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Constants/Header';
import BottomNav from './Constants/BottomNav';
import FileStorage from '../assets/FileStorage';

const Settings = ({ navigation, route }) => {
  const { user } = route.params;
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Local state for user info
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    country: user?.country || '',
    address: user?.address || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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
      ]
    );
  };

  const openEditModal = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      Alert.alert('Error', 'Field cannot be empty');
      return;
    }

    setLoading(true);

    try {
      // Get all users
      const users = await FileStorage.getUsers();
      
      // Find the current user index
      const userIndex = users.findIndex(
        (u) => (u.phoneNumber || u.phone) === user.phoneNumber
      );

      if (userIndex === -1) {
        Alert.alert('Error', 'User not found');
        setLoading(false);
        return;
      }

      // Update the specific field
      users[userIndex][editField] = editValue;

      // Save back to storage
      await FileStorage.updateUser(users[userIndex]);

      // Update local state
      setUserInfo((prev) => ({
        ...prev,
        [editField]: editValue,
      }));

      setLoading(false);
      setEditModalVisible(false);
      Alert.alert('Success', 'Information updated successfully!');
    } catch (error) {
      setLoading(false);
      console.log('Error updating user:', error);
      Alert.alert('Error', 'Failed to update information');
    }
  };

  const SettingItem = ({ icon, label, value, onPress, editable = true }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!editable}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#0A1F44" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingValue}>{value || 'Not set'}</Text>
        </View>
      </View>
      {editable && (
        <Ionicons name="chevron-forward" size={24} color="#888" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header text="" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account information</Text>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <SettingItem
            icon="person"
            label="Name"
            value={userInfo.name}
            onPress={() => openEditModal('name', userInfo.name)}
          />

          <SettingItem
            icon="call"
            label="Phone Number"
            value={userInfo.phoneNumber}
            editable={false}
          />

          <SettingItem
            icon="mail"
            label="Email"
            value={userInfo.email}
            onPress={() => openEditModal('email', userInfo.email)}
          />

          <SettingItem
            icon="calendar"
            label="Age"
            value={userInfo.age}
            onPress={() => openEditModal('age', userInfo.age)}
          />

          <SettingItem
            icon="male-female"
            label="Gender"
            value={userInfo.gender}
            onPress={() => openEditModal('gender', userInfo.gender)}
          />

          <SettingItem
            icon="earth"
            label="Country"
            value={userInfo.country}
            onPress={() => openEditModal('country', userInfo.country)}
          />

          <SettingItem
            icon="location"
            label="Address"
            value={userInfo.address}
            onPress={() => openEditModal('address', userInfo.address)}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${editField}`}
              placeholderTextColor="#999"
              keyboardType={editField === 'age' ? 'numeric' : 'default'}
              autoCapitalize={editField === 'email' ? 'none' : 'words'}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav active="settings" navigation={navigation} user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9daddff',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1F44',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: '#506071',
    marginBottom: 25,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1F44',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F44',
    marginBottom: 3,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#0A1F44',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A1F44',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0A1F44',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Settings;