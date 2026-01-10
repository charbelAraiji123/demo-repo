import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import Header from '../Constants/Header';
import FileStorage from '../../assets/FileStorage';

const CreateAccount = ({ navigation, route }) => {
  const { phoneNumber, name, gender, country, address, age } = route.params;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '', color: '#ccc' });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ level: 0, text: '', color: '#ccc' });
      return;
    }

    let strength = 0;
    let text = '';
    let color = '';

    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;

    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

    // Contains numbers
    if (/\d/.test(password)) strength += 1;

    // Contains special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    // Determine strength level
    if (strength <= 1) {
      text = 'Weak';
      color = '#ff4444';
    } else if (strength <= 3) {
      text = 'Medium';
      color = '#ffaa00';
    } else {
      text = 'Strong';
      color = '#00C851';
    }

    setPasswordStrength({ level: strength, text, color });
  }, [password]);

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
      name,
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
      const exists = users.some(u => 
        (u.phoneNumber || u.phone) === userData.phoneNumber
      );
      
      if (exists) {
        setLoading(false);
        Alert.alert('Error', 'This phone number is already registered');
        return;
      }

      console.log("Before saving - userData:", userData);
      await FileStorage.printUsers();

      const result = await FileStorage.addUser(userData);

      console.log("After saving - result:", result);
      await FileStorage.printUsers();

      setLoading(false);

      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to Dashboard directly
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard', params: { user: userData } }],
                });
              }
            }
          ]
        );
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Header text="" />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Display User Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Account Information</Text>
            <Text style={styles.infoText}>Name: {name}</Text>
            <Text style={styles.infoText}>Phone: {phoneNumber}</Text>
          </View>

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
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBackground}>
                  <View 
                    style={[
                      styles.strengthBarFill, 
                      { 
                        width: `${(passwordStrength.level / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
            )}
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
            Your password must be at least 6 characters long.{"\n"}
            Make sure both passwords match to create your account.
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#f0f4f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0A1F44',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A1F44',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
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
  strengthContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 60,
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