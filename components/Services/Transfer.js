import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import Header from '../Constants/Header';
import BottomNav from '../Constants/BottomNav';
import FileStorage from '../../assets/FileStorage';

const Transfer = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [number, setNumber] = useState('');
  const [note, setNote] = useState('');
  const [pendingTransfers, setPendingTransfers] = useState([]);

  const user = route.params?.user;

  // Load pending transfers
  useEffect(() => {
    const loadPending = async () => {
      if (!user) return;
      try {
        const allPending = await FileStorage.getPendingTransfersBySender(
          user.phoneNumber
        );
        setPendingTransfers(allPending);
      } catch (err) {
        Alert.alert("Error", "Failed to load pending transfers");
      }
    };
    loadPending();
  }, [user]);

  // ================================
  // ⭐ FULL LOGIC FROM ORIGINAL CODE
  // ================================
  const handleContinue = async () => {
    if (!user) {
      Alert.alert("Error", "Sender not found. Please login again.");
      return;
    }

    if (!number.trim() || !amount.trim()) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert("Error", "Enter a valid amount");
      return;
    }

    // Normalize phone number
    let inputNumber = number.trim().replace(/\s+/g, '');
    if (!inputNumber.startsWith('+961')) inputNumber = '+961' + inputNumber;

    const allUsers = await FileStorage.getUsers();
    const receiverUser = allUsers.find(u => u.phoneNumber === inputNumber);

    if (!receiverUser) {
      Alert.alert("Error", "Receiver not found");
      return;
    }

    const senderBalance = await FileStorage.getUserBalance(user.phoneNumber);

    if (senderBalance === null || senderBalance < amt) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }

    // Deduct sender balance
    await FileStorage.updateUserBalance(
      user.phoneNumber,
      senderBalance - amt
    );

    // Add pending transfer
    await FileStorage.addPendingTransfer({
      from: user.phoneNumber,
      to: receiverUser.phoneNumber,
      amount: amt,
      note: note || ""
    });

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
    setAmount('');
    setNumber('');
    setNote('');
  };

  // ================================
  // ⭐ UI FROM CLEANER DESIGN
  // ================================
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Header text="" />

          <View style={styles.content}>

            {/* Receiver Phone */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Receiver’s Phone Number</Text>
              <TextInput
                style={styles.input}
                value={number}
                placeholder="Enter phone number"
                onChangeText={setNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Amount */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Amount to Transfer (USD)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                placeholder="0.00"
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Note */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Leave a Note (optional)</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={note}
                placeholder="Add a message..."
                multiline
                textAlignVertical="top"
                onChangeText={setNote}
              />
            </View>

            {/* Warning Message */}
            <Text style={styles.warning}>
              Be careful: if you fall victim to a scam you may not get your money back.
              {"\n"}Cancellation is not available for transfers.
            </Text>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

      <BottomNav active="send" navigation={navigation} user={user} />
    </KeyboardAvoidingView>
  );
};

// ================================
// ⭐ Styles
// ================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d9daddff' },

  scrollContentContainer: { paddingBottom: 50 },

  content: { padding: 20 },

  inputSection: { marginBottom: 20 },

  label: { fontSize: 18, color: '#0A1F44', fontWeight: '600', marginBottom: 8 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 18,
  },

  noteInput: {
    height: 100,
  },

  warning: {
    color: '#fd0000ac',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 25,
    fontWeight: '600',
    lineHeight: 20,
  },

  button: {
    backgroundColor: '#0A1F44',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },

  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});

export default Transfer;
