import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Header from "../../Constants/Header";
import BottomNav from "../../Constants/BottomNav";
import FileStorage from "../../../assets/FileStorage";

const ClaimReceive = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const currentUser = route.params?.user;

  const normalizePhone = (phone) =>
    phone.replace(/\s/g, "").replace(/^\+/, "");

  const loadPendingTransfers = async () => {
    if (!currentUser) return;
    try {
      const allTransfers = await FileStorage.getPendingTransfers();
      const userTransfers = allTransfers.filter(
        (t) =>
          normalizePhone(t.to) === normalizePhone(currentUser.phoneNumber) &&
          !t.claimed
      );

      setPendingTransfers(userTransfers);
    } catch (err) {
      Alert.alert("Error", "Failed to load incoming transfers");
    }
  };

  useEffect(() => {
    loadPendingTransfers();
    const unsubscribe = navigation.addListener("focus", loadPendingTransfers);
    return unsubscribe;
  }, [currentUser, navigation]);

  const claimTransfer = async (transfer) => {
    if (loadingIds.includes(transfer.id)) return;
    setLoadingIds((prev) => [...prev, transfer.id]);

    try {
      const receiverBalance = await FileStorage.getUserBalance(transfer.to);

      if (receiverBalance === null) {
        Alert.alert("Error", "Invalid receiver account");
        return;
      }

      // Add amount to receiver's balance
      const newReceiverBalance = receiverBalance + transfer.amount;

      await FileStorage.updateUserBalance(transfer.to, newReceiverBalance);

      // Mark transfer as claimed
      await FileStorage.markTransferClaimed(transfer.id);

      // Remove from pending list
      setPendingTransfers((prev) =>
        prev.filter((t) => t.id !== transfer.id)
      );

      Alert.alert("Success", `You received $${transfer.amount}`, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Dashboard", {
              user: {
                ...currentUser,
                balance: newReceiverBalance,
              },
            });
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Something went wrong during claim");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== transfer.id));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header text="" />

        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.headerText, styles.colPhone]}>Phone</Text>
            <Text style={[styles.headerText, styles.colAmount]}>Amount</Text>
            <Text style={[styles.headerText, styles.colNote]}>Note</Text>
            <Text style={[styles.headerText, styles.colClaimed]}>Action</Text>
          </View>

          {pendingTransfers.length === 0 ? (
            <Text style={styles.noTransfers}>No pending transfers</Text>
          ) : (
            pendingTransfers.map((transfer, index) => (
              <View key={transfer.id || index} style={styles.tableRow}>
                <Text style={[styles.rowText, styles.colPhone]}>
                  {transfer.from}
                </Text>

                <Text style={[styles.rowText, styles.colAmount]}>
                  ${transfer.amount}
                </Text>

                <TouchableOpacity
                  style={[styles.noteButton, styles.colNote]}
                  onPress={() => {
                    setSelectedNote(transfer.note);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.noteButtonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.claimButton,
                    styles.colClaimed,
                    loadingIds.includes(transfer.id) && styles.claimedButton,
                  ]}
                  disabled={loadingIds.includes(transfer.id)}
                  onPress={() => claimTransfer(transfer)}
                >
                  <Text style={styles.claimButtonText}>
                    {loadingIds.includes(transfer.id)
                      ? "Claiming..."
                      : "Claim"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Transfer Note</Text>
              <Text style={styles.modalText}>
                {selectedNote || "No note provided"}
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <BottomNav
        active="receive"
        navigation={navigation}
        user={currentUser}
      />
    </View>
  );
};

export default ClaimReceive;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9daddff" },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 90 },

  tableContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#0A1F44",
  },

  tableHeader: {
    backgroundColor: "#0A1F44",
  },

  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 10,
    textAlign: "center",
  },

  rowText: {
    fontSize: 15,
    color: "#fff",
    paddingVertical: 10,
    textAlign: "center",
  },

  noTransfers: {
    textAlign: "center",
    fontSize: 16,
    padding: 20,
    color: "#0A1F44",
  },

  colPhone: { flex: 1.5 },
  colAmount: { flex: 1 },
  colNote: { flex: 1.2 },
  colClaimed: { flex: 1 },

  noteButton: {
    backgroundColor: "#1c4c6eff",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },

  noteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  claimButton: {
    backgroundColor: "#1c4c6eff",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },

  claimedButton: {
    backgroundColor: "#3374a2ff",
  },

  claimButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0A1F44",
  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },

  closeButton: {
    backgroundColor: "#0A1F44",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});