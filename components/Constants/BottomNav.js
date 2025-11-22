import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = ({ active, navigation, user }) => {
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);

  // Safety check
  if (!navigation) {
    console.warn('BottomNav: navigation prop is missing');
    return null;
  }

  if (!user) {
    console.warn("BottomNav: user prop is missing");
  }

  return (
    <>
      <View style={styles.container}>
        
        {/* Dashboard */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Dashboard", { user })}
        >
          <Ionicons name="home" size={28} color={active === 'dashboard' ? '#0A1F44' : '#888'} />
          <Text style={[styles.label, active === 'dashboard' && styles.activeLabel]}>Dashboard</Text>
        </TouchableOpacity>

        {/* Send */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Transfer", { user })}
        >
          <Ionicons name="arrow-up-circle" size={28} color={active === 'send' ? '#0A1F44' : '#888'} />
          <Text style={[styles.label, active === 'send' && styles.activeLabel]}>Send</Text>
        </TouchableOpacity>

        {/* Receive Modal */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setReceiveModalVisible(true)}
        >
          <Ionicons name="arrow-down-circle" size={28} color={active === 'receive' ? '#0A1F44' : '#888'} />
          <Text style={[styles.label, active === 'receive' && styles.activeLabel]}>Receive</Text>
        </TouchableOpacity>

        {/* History */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('History', { user })}
        >
          <Ionicons name="list" size={28} color={active === 'transactions' ? '#0A1F44' : '#888'} />
          <Text style={[styles.label, active === 'transactions' && styles.activeLabel]}>Transactions</Text>
        </TouchableOpacity>

      </View>

      {/* Receive Modal */}
      <Modal
        visible={receiveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReceiveModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Receive Options</Text>

            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setReceiveModalVisible(false);
                  navigation.navigate('LinkReceive', { user });
                }}
              >
                <Text style={styles.modalButtonText}>Link Receive</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setReceiveModalVisible(false);
                  navigation.navigate('ClaimReceive', { user });
                }}
              >
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

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#f2f6ff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: { 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 4 
  },
  activeLabel: { 
    color: '#0A1F44', 
    fontWeight: '700' 
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
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A1F44',
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#0A1F44',
    paddingVertical: 18,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCancel: {
    marginTop: 5,
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1F44',
  },
});

export default BottomNav;
