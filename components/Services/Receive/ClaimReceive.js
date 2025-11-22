import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert 
} from 'react-native';
import Header from '../../Constants/Header';
import BottomNav from '../../Constants/BottomNav';
import FileStorage from '../../../assets/FileStorage';

const ClaimReceive = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const currentUser = route.params?.user;

  const normalizePhone = (phone) => phone.replace(/\s/g, '').replace(/^\+/, '');

  const loadPendingTransfers = async () => {
    if (!currentUser) return;
    try {
      const allTransfers = await FileStorage.getPendingTransfers();
      const userTransfers = allTransfers.filter(
        t => normalizePhone(t.to) === normalizePhone(currentUser.phoneNumber) && !t.claimed
      );
      setPendingTransfers(userTransfers);
      console.log("Pending transfers loaded:", userTransfers);
    } catch (err) {
      console.log("Load pending transfers error:", err);
      Alert.alert("Error", "Failed to load incoming transfers");
    }
  };

  useEffect(() => {
    loadPendingTransfers();
    const unsubscribe = navigation.addListener('focus', loadPendingTransfers);
    return unsubscribe;
  }, [currentUser, navigation]);

  const claimTransfer = async (transfer) => {
  if (loadingIds.includes(transfer.id)) return;
  setLoadingIds(prev => [...prev, transfer.id]);

  try {
    console.log("Claiming transfer:", transfer);

    const senderBalance = await FileStorage.getUserBalance(transfer.from);
    const receiverBalance = await FileStorage.getUserBalance(transfer.to);

    if (senderBalance === null || receiverBalance === null) {
      Alert.alert("Error", "Invalid sender or receiver account");
      return;
    }

    if (senderBalance < transfer.amount) {
      Alert.alert("Error", "Sender has insufficient balance");
      return;
    }

    // Update balances
    await FileStorage.updateUserBalance(transfer.from, senderBalance - transfer.amount);
    const newReceiverBalance = receiverBalance + transfer.amount;
    await FileStorage.updateUserBalance(transfer.to, newReceiverBalance);

    // Mark transfer as claimed
    await FileStorage.markTransferClaimed(transfer.id);

    // Remove from state immediately
    setPendingTransfers(prev => prev.filter(t => t.id !== transfer.id));

    // Show success alert and navigate to Dashboard with updated balance
    Alert.alert(
  "Success",
  `You received $${transfer.amount} from ${transfer.from}`,
  [
    {
      text: "OK",
      onPress: () => {
        const updatedUser = { ...currentUser, balance: receiverBalance + transfer.amount };
        navigation.navigate("Dashboard", { user: updatedUser });
      },
    },
  ]
);

  } catch (err) {
    console.log("Claim error:", err);
    Alert.alert("Error", "Something went wrong during claim");
  } finally {
    setLoadingIds(prev => prev.filter(id => id !== transfer.id));
  }
};


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
        <Header text="Claim Transfers" />
        <Text style={styles.title}>Incoming Transfers</Text>

        {pendingTransfers.length === 0 ? (
          <Text style={styles.noTransfers}>No pending transfers</Text>
        ) : (
          <View>
            <View style={[styles.row, { backgroundColor: 'transparent', paddingVertical: 6 }]}>
              <Text style={[styles.cell, styles.fromCol, { fontWeight: '700', color: '#0A1F44' }]}>From</Text>
              <Text style={[styles.cell, styles.amountCol, { fontWeight: '700', color: '#0A1F44' }]}>Amount</Text>
              <Text style={[styles.cell, { flex: 0.9, textAlign: 'center', fontWeight: '700', color: '#0A1F44' }]}>Note</Text>
              <Text style={[styles.cell, { flex: 0.9, textAlign: 'center', fontWeight: '700', color: '#0A1F44' }]}>Action</Text>
            </View>

            {pendingTransfers.map((transfer, index) => (
              <View key={`${transfer.id}-${index}`} style={styles.row}>
                <Text style={[styles.cell, styles.fromCol]}>{transfer.from}</Text>
                <Text style={[styles.cell, styles.amountCol]}>${transfer.amount}</Text>

                <TouchableOpacity
                  style={styles.noteButton}
                  onPress={() => {
                    setSelectedNote(transfer.note);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.noteButtonText}>Note</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[transfer.claimed ? styles.claimedButton : styles.claimButton]}
                  onPress={() => claimTransfer(transfer)}
                  disabled={loadingIds.includes(transfer.id)}
                >
                  <Text style={styles.claimButtonText}>
                    {loadingIds.includes(transfer.id) ? "Claiming..." : "Claim"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Transfer Note</Text>
              <Text style={styles.modalText}>{selectedNote || "No note provided"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <BottomNav active="receive" navigation={navigation} user={currentUser} />

    </View>
  );
};

export default ClaimReceive;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9daddff" },
  title: { fontSize: 20, marginTop: 15, fontWeight: "700", color: "#0A1F44", textAlign: "center" },
  noTransfers: { fontSize: 16, textAlign: "center", marginTop: 20 },
  row: { flexDirection: "row", backgroundColor: "#0A1F44", padding: 10, borderRadius: 8, marginTop: 10, alignItems: "center" },
  cell: { color: "#fff", fontSize: 16, textAlign: "center" },
  fromCol: { flex: 1.5 },
  amountCol: { flex: 1 },
  noteButton: { backgroundColor: "#1c4c6e", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 6 },
  noteButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  claimButton: { backgroundColor: "#28a745", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  claimedButton: { backgroundColor: "#6c757d", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  claimButtonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", width: "80%", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  modalText: { fontSize: 17, marginBottom: 20, textAlign: "center" },
  closeButton: { backgroundColor: "#0A1F44", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  closeText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});
