import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../Constants/Header';
import BottomNav from '../Constants/BottomNav';
import FileStorage from '../../assets/FileStorage';
import { v4 as uuidv4 } from 'uuid';

const Transfer = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [number, setNumber] = useState('');
  const [note, setNote] = useState('');
  const [pendingTransfers, setPendingTransfers] = useState([]);

  const user = route.params?.user;

  // Load pending transfers for this user
  useEffect(() => {
    const loadPending = async () => {
      if (!user) return;
      try {
        const allPending = await FileStorage.getPendingTransfersBySender(user.phoneNumber);
        setPendingTransfers(allPending);
      } catch (err) {
        console.log("Load pending error:", err);
        Alert.alert("Error", "Failed to load pending transfers");
      }
    };
    loadPending();
  }, [user]);

  const handleContinue = async () => {
  console.log("=== Transfer Start ===");

  if (!user) {
    console.log("Sender info missing");
    Alert.alert("Error", "Sender information not found. Please login again.");
    return;
  }

  if (!number || !amount) {
    console.log("Input fields missing");
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    console.log("Invalid amount:", amount);
    Alert.alert("Error", "Enter a valid amount");
    return;
  }

  // Format receiver number
  let inputNumber = number.trim().replace(/\s+/g, '');
  if (!inputNumber.startsWith('+961')) inputNumber = '+961' + inputNumber;

  console.log("Formatted receiver number:", inputNumber);

  const allUsers = await FileStorage.getUsers();
  console.log("All users:", allUsers);

  const receiverUser = allUsers.find(u => u.phoneNumber === inputNumber);
  if (!receiverUser) {
    console.log("Receiver not found");
    Alert.alert("Error", "Receiver not found");
    return;
  }
  console.log("Receiver found:", receiverUser);

  const senderBalance = await FileStorage.getUserBalance(user.phoneNumber);
  console.log("Sender balance:", senderBalance);

  if (senderBalance === null || senderBalance < amt) {
    console.log("Insufficient balance");
    Alert.alert("Error", "Insufficient balance");
    return;
  }

  // Deduct sender balance
  await FileStorage.updateUserBalance(user.phoneNumber, senderBalance - amt);
  console.log(`Updated sender balance: ${senderBalance - amt}`);

  // Add pending transfer (only minimal fields, let FileStorage add id, timestamps)
  const pendingAdded = await FileStorage.addPendingTransfer({
    from: user.phoneNumber,
    to: receiverUser.phoneNumber,
    amount: amt,
    note: note || ""
  });

  console.log("Pending transfer added:", pendingAdded);

  // Check AsyncStorage content after adding
  const allPending = await FileStorage.getPendingTransfers();
  console.log("All pending transfers now:", allPending);

  Alert.alert("Success", "Transfer sent successfully!", [
    { 
      text: "OK", 
      onPress: () => {
        const updatedUser = { ...user, balance: senderBalance - amt };
        navigation.navigate("Dashboard", { user: updatedUser });
      } 
    }
  ]);

  // Clear inputs
  setAmount("");
  setNumber("");
  setNote("");
};


  return (
    <View style={styles.container}>
      <Header text="Send Money" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Receiver Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter receiver number"
            value={number}
            onChangeText={setNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>

        <Text style={styles.pendingTitle}>Pending Transfers:</Text>
        {pendingTransfers.length === 0 ? (
  <Text>No pending transfers</Text>
) : (
  pendingTransfers.map((t, index) => (
    <View key={t.id || index} style={styles.pendingItem}>
      <Text>To: {t.to}</Text>
      <Text>Amount: ${t.amount}</Text>
      <Text>Note: {t.note || '-'}</Text>
    </View>
  ))
)}



      </ScrollView>
      <BottomNav active="transfer" navigation={navigation} user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d9daddff' },
  content: { padding: 20 },
  inputSection: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#0A1F44' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 14, backgroundColor: '#fff', fontSize: 16 },
  button: { backgroundColor: '#0A1F44', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  pendingTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, marginTop: 10 },
  pendingItem: { padding: 12, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, elevation: 2 }
});

export default Transfer;
