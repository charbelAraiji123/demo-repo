import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import Header from './Constants/Header';
import BottomNav from './Constants/BottomNav';
import FileStorage from '../assets/FileStorage';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation, route }) => {
  const [balance, setBalance] = useState(0);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);

  // Get only phoneNumber from params
  const userPhone = route.params?.user?.phoneNumber;
  const user = route.params?.user;

  // Load balance from FileStorage
  useEffect(() => {
    const loadBalance = async () => {
      if (!userPhone) return;
      const fetchedBalance = await FileStorage.getUserBalance(userPhone);
      setBalance(fetchedBalance ?? 0); // fallback to 0
    };

    loadBalance();

    // Reload balance whenever dashboard is focused (after sending/claiming)
    const unsubscribe = navigation.addListener('focus', () => {
      loadBalance();
    });

    return unsubscribe;
  }, [userPhone, navigation]);

  return (
    <View style={styles.container}>
      <Header text="" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Manage your account and explore features</Text>

        {/* Balance Card */}
        <TouchableOpacity style={styles.balanceCard}>
          <Text style={styles.cardTitle}>Balance</Text>
          <Text style={styles.cardValue}>${balance}</Text>
        </TouchableOpacity>

        {/* Send & Receive Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Transfer", { user })}
          >
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setReceiveModalVisible(true)}
          >
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Cards */}
        <View style={styles.cardGrid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('History', { user })}>
            <Text style={styles.cardTitle}>Transactions</Text>
            <Text style={styles.cardValue}>View All</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Settings', { user })}
          >
            <Text style={styles.cardTitle}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { width: '100%' }]} onPress={() => navigation.navigate('Support', { user })}>
  <Text style={styles.cardTitle}>Support</Text>
</TouchableOpacity>
        </View>
      </ScrollView>

      {/* Receive Modal */}
      <Modal visible={receiveModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Receive Method</Text>

            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setReceiveModalVisible(false);
                  navigation.navigate('LinkReceive', { phoneNumber: userPhone });
                }}>
                <Text style={styles.modalButtonText}>Link Receive</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setReceiveModalVisible(false);
                  navigation.navigate('ClaimReceive', { user });
                }}>
                <Text style={styles.modalButtonText}>Claim Receive</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setReceiveModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav active="dashboard" navigation={navigation} user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d9daddff' },
  content: { paddingHorizontal: 20, paddingBottom: 100, marginTop: 20 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#0A1F44', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#506071', marginBottom: 20, textAlign: 'center' },
  balanceCard: { backgroundColor: '#fff', borderRadius: 20, width: '100%', height: 120, marginBottom: 20, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, width: (width - 60) / 2, height: 120, marginBottom: 20, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#0A1F44', marginBottom: 8 },
  cardValue: { fontSize: 18, fontWeight: '600', color: '#00A8E8' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { backgroundColor: '#fff', width: (width - 60) / 2, height: 120, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  actionText: { color: '#0A1F44', fontSize: 20, fontWeight: '700' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#0A1F44', marginBottom: 20 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  modalButton: { flex: 1, backgroundColor: '#0A1F44', paddingVertical: 18, borderRadius: 15, marginHorizontal: 5, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  modalCancel: { marginTop: 5, paddingVertical: 10 },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: '#0A1F44' }
});

export default Dashboard;