import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import Header from '../Constants/Header';
import FileStorage from '../../assets/FileStorage';


const CreateAccount = ({ navigation, route }) => {
  const { phoneNumber, email: userEmail, gender, country, address, age } = route.params;
  
  const [email, setEmail] = useState(userEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

 const handleCreateAccount = async () => {
  if (!email.trim()) {
    Alert.alert('Error', 'Please enter your email');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  setLoading(true);

  const userData = {
    phoneNumber,
    email,
    password,
    gender,
    country,
    address,
    age,
    balance: 100,
  };

  try {
    // Load current users
    const users = await FileStorage.getUsers();

    // Check uniqueness of phone number
    const exists = users.some(u => u.phoneNumber === userData.phoneNumber);
    if (exists) {
      setLoading(false);
      Alert.alert('Error', 'This phone number is already registered');
      return;
    }

    console.log("Before saving:");
    await FileStorage.printFile();

    const result = await FileStorage.addUser(userData);

    console.log("After saving:");
    await FileStorage.printFile();

    setLoading(false);

    if (result.success) {
      // Navigate to Dashboard directly
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard', params: { user: userData } }],
      });
    } else {
      Alert.alert('Error', result.message);
    }
  } catch (error) {
    setLoading(false);
    console.log("Error in handleCreateAccount:", error);
    Alert.alert('Error', 'Something went wrong while saving the user.');
  }
};




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

            {/* Email Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!userEmail}
              />
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

            {/* Confirm Password Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Info Message */}
            <Text style={styles.info}>
              Your password must be at least 6 characters long.
              {"\n"}Make sure both passwords match to create your account.
            </Text>

            {/* Create Account Button */}
            <TouchableOpacity 
              onPress={handleCreateAccount} 
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Already have account */}
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Log In</Text>
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

  scrollContentContainer: {
    paddingBottom: 40,
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

  info: {
    color: '#0A1F44',
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
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
});

export default CreateAccount;
