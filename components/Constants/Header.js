import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = ({ text }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logoMobile-removebg-preview.png')}
        style={styles.logoImage}
      />
      <Text style={styles.title}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A1F44",
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width:390,
    maxHeight:250,
    height:200,
  },

  logoImage: {
    width: 170,
    height: 170,
    marginTop:70,
    marginBottom: 0,
    resizeMode: "contain",
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Header;