import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Clipboard 
} from 'react-native';
import Header from '../../Constants/Header';
import BottomNav from '../../Constants/BottomNav';
import FileStorage from '../../../assets/FileStorage';


const LinkReceive = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [payerName, setPayerName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [fakeLink, setFakeLink] = useState('');

  const handleContinue = () => {
    // Validation
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter payer\'s phone number');
      return;
    }
    if (!payerName.trim()) {
      Alert.alert('Error', 'Please enter payer\'s full name');
      return;
    }
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Generate a fake link
    const link = `https://payme.com/request/${Math.floor(Math.random() * 1000000)}`;
    setFakeLink(link);

    // Show modal
    setModalVisible(true);

    // Clear inputs
    setPhoneNumber('');
    setPayerName('');
    setAmount('');
    setNote('');
  };

  const handleCopy = () => {
    Clipboard.setString(fakeLink);
    Alert.alert('Copied', 'Payment link copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header text="" />

        <View style={styles.content}>
          {/* Phone Number */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Payer's Phone Number</Text>
            <TextInput 
              style={styles.input}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+961 "
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Payer's Full Name</Text>
            <TextInput 
              style={styles.input}
              keyboardType="default"
              value={payerName}
              onChangeText={setPayerName}
              placeholder="name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Amount */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Amount to Receive (USD)</Text>
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>

          {/* Note */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Leave a Note (optional)</Text>
            <TextInput 
              style={[styles.input, styles.noteInput]}
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
              placeholder="Payment for..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Warning */}
          <Text style={styles.warning}>
            Send a link to your Customers, Friends, and Family to Pay You by Debit/Credit Card
            {"\n"}An Extra 1% Will Be Deducted on Cash Out.
          </Text>

          {/* Button */}
          <TouchableOpacity onPress={handleContinue} style={styles.button}>
            <Text style={styles.buttonText}>Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="receive" navigation={navigation} />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Link Generated!</Text>
            <Text style={styles.modalLink}>{fakeLink}</Text>

            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LinkReceive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9daddff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  content: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#0A1F44',
    fontWeight: '600',
    marginBottom: 8,
  },
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
    textAlignVertical: 'top',
  },
  warning: {
    color: '#fd0000ac',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 20,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0A1F44',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalLink: {
    fontSize: 16,
    color: '#0A1F44',
    marginBottom: 20,
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#0A1F44',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 10,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0A1F44',
  },
  closeButtonText: {
    color: '#0A1F44',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
