import React, { useState } from 'react';
import FileStorage from '../assets/FileStorage';
import { useEffect } from 'react';

import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import Header from './Constants/Header';

const Login = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState('+961');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  

  const printUsers = async () => {
  const users = await FileStorage.getUsers();
  console.log('All users:', users);
};

// Call this somewhere (e.g., after component mounts)
printUsers()

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const fullPhone = countryCode + phoneNumber;
      const result = await FileStorage.validateUser(fullPhone, password);

      setLoading(false);

      if (result.success) {
        // Show success message
        Alert.alert('Success', 'Login successful!');

        // Navigate to Dashboard and reset the stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard', params: { user: result.user } }],
        });
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Header text="" />
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            {/* Phone Number Input */}
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

            {/* Password Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              onPress={handleLogin} 
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity 
              style={styles.signupLink}
              onPress={() => navigation.navigate('GetStarted')}
            >
              <Text style={styles.signupLinkText}>
                Don't have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9daddff',
  },

  scrollContent: {
    paddingBottom: 0,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A1F44',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
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

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 18,
  },

  button: {
    backgroundColor: '#0A1F44',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  signupLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  signupLinkText: {
    fontSize: 16,
    color: '#666',
  },

  signupLinkBold: {
    color: '#0A1F44',
    fontWeight: 'bold',
  },
});

export default Login;
