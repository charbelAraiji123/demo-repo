import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './Constants/Header';

const Welcome = ({ navigation }) => {
  const handleSignup = () => {
    navigation.navigate("GetStarted");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <View>
        <Header text="" />
      </View>

      {/* Logo + Text */}
      <View style={styles.logoContainer}>
       {/* <Text style={styles.title}>PECUNIA</Text> */}
        <Text style={styles.subtitle}>
          Manage your money easily, securely, and quickly.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.buttonPrimary}>
          <Text style={styles.buttonTextPrimary}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignup} style={styles.buttonSecondary}>
          <Text style={styles.buttonTextSecondary}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9daddff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -150,
    
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0A1F44',
  },
  subtitle: {
    fontSize: 18,
    color: '#0A1F44',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -100,
  },
  buttonPrimary: {
    width: '80%',
    backgroundColor: '#0A1F44',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#0A1F44',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonSecondary: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#0A1F44',
    backgroundColor: '#0A1F44',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Welcome;