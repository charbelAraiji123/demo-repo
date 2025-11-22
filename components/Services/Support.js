import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Linking, SafeAreaView } from 'react-native';
import Header from '../Constants/Header';
import BottomNav from '../Constants/BottomNav';

const Support = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    console.log('Message sent:', { name, email, message });
    setName('');
    setEmail('');
    setMessage('');
    alert('Your message has been sent!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header text="" />
      
      <ScrollView contentContainerStyle={styles.content} style={{ flex: 1 }}>
        {/* Contact Form */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Send Message</Text>
        </TouchableOpacity>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>FAQ</Text>
        <View style={styles.faqItem}>
          <Text style={styles.question}>How do I reset my password?</Text>
          <Text style={styles.answer}>Go to settings and click 'Reset Password'.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.question}>How can I contact support?</Text>
          <Text style={styles.answer}>You can fill this form or email support@mybanking.com.</Text>
        </View>

        {/* Customer Service Info */}
        <Text style={styles.sectionTitle}>Customer Service</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+1234567890')}>
          <Text style={styles.contactInfo}>Phone: +1 234 567 890</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@mybanking.com')}>
          <Text style={styles.contactInfo}>Email: support@mybanking.com</Text>
        </TouchableOpacity>

        {/* Legal Links */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.example.com/privacy')}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.example.com/terms')}>
          <Text style={styles.link}>Terms of Service</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="support" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f6ff' },
  content: { padding: 20, paddingBottom: 100 }, // paddingBottom to avoid overlap with bottom nav
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#001f3f', marginVertical: 15 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 },
  submitBtn: { backgroundColor: '#001f3f', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  faqItem: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  question: { fontWeight: '700', fontSize: 16, color: '#001f3f', marginBottom: 5 },
  answer: { fontSize: 14, color: '#444' },
  contactInfo: { fontSize: 16, color: '#001f3f', marginBottom: 10 },
  link: { fontSize: 16, color: '#1A73E8', marginBottom: 10, textDecorationLine: 'underline' },
});

export default Support;
