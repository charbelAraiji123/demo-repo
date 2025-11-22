import React, { useState } from 'react';
import Header from '../Constants/Header';
import FileStorage from '../../assets/FileStorage';



import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PersonalInformationScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');

  const handleSignup = () => {
    navigation.navigate("CreateAccount", {
      phoneNumber,
      name,
      gender,
      country,
      address,
      age
    });
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

            {/* Name */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                keyboardType="default"
                placeholder="Name"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={gender}
                onChangeText={setGender}
                placeholder="Male/Female/Other"
                placeholderTextColor="#999"
              />
            </View>

            {/* Country */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Country of Residence</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor="#999"
              />
            </View>

            {/* Address */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                placeholderTextColor="#999"
              />
            </View>

            {/* Age */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="Enter your age"
                placeholderTextColor="#999"
              />
            </View>

            {/* Info Message */}
            <Text style={styles.info}>
              Please ensure all information is accurate.
              {"\n"}This information will be used for account verification.
            </Text>

            {/* Button */}
            <TouchableOpacity onPress={handleSignup} style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
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
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PersonalInformationScreen;
