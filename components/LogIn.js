import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Header from './Constants/Header';
import FileStorage from '../assets/FileStorage';

const LogIn = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    // Check for admin credentials
    if (phone === '0000' && password === 'admin123') {
      navigation.navigate('AdminDashboard');
      setPhone('');
      setPassword('');
      return;
    }

    setLoading(true);

    try {
      // Try with the phone number as entered
      let result = await FileStorage.validateUser(phone, password);

      // If not found and phone doesn't start with +, try with +961 prefix
      if (!result.success && !phone.startsWith('+')) {
        result = await FileStorage.validateUser('+961' + phone, password);
      }

      setLoading(false);

      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard', params: { user: result.user } }],
        });
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>

          {/* Phone Number Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <Text style={styles.hint}>
              Enter with country code (e.g., +9611234567) or without
            </Text>
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
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('GetStarted')}
          >
            <Text style={styles.signupLinkText}>
              Don't have an account?{' '}
              <Text style={styles.signupLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A1F44',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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

export default LogIn;