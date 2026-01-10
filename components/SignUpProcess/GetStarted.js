import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Modal, Alert, ScrollView
} from 'react-native';
import Header from '../Constants/Header';

const GetStartedScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countryCode, setCountryCode] = useState('+961');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignup = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // Open modal for OTP
    setModalVisible(true);
  };

  const handleChangeOtp = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code !== '0000') {
      Alert.alert('Error', 'Invalid verification code');
      return;
    }

    setModalVisible(false);
    setOtp(["", "", "", ""]);

    const fullPhone = countryCode + phoneNumber;

    // Just navigate with the phone number - don't save user yet
    navigation.navigate("PersonalInformation", { phoneNumber: fullPhone });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Header text="" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Get Started</Text>

          <Text style={styles.description}>
            Enter your mobile number. We will send you a confirmation code there.
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneRow}>
              <TextInput
                style={styles.codeInput}
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                maxLength={5}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.numberInput}
                placeholder="Enter your number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <Text style={styles.terms}>
            By entering your phone number, you agree to our terms and conditions.
          </Text>

          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Confirmation Code</Text>
            <Text style={styles.modalText}>We've sent a verification code to your phone</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeOtp(text, index)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
              <Text style={styles.verifyText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9daddff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 25,
    paddingTop: 35,
  },
  title: {
    fontSize: 39,
    fontWeight: 'bold',
    color: '#0A1F44',
    marginBottom: 20,
  },
  description: {
    color: '#333',
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#0A1F44',
    fontWeight: '600',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 18,
    backgroundColor: '#fff',
    textAlign: 'center',
    marginRight: 10,
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  terms: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0A1F44',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#666',
  },
  loginLinkBold: {
    color: '#0A1F44',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0A1F44',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: '80%',
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    backgroundColor: '#fff',
  },
  verifyButton: {
    backgroundColor: '#0A1F44',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
  },
  verifyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 16,
    color: '#888',
  },
});

export default GetStartedScreen;