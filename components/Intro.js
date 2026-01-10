// components/Intro.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const Intro = ({ navigation }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -30,
          duration: 500,
          easing: Easing.bezier(0.33, 0, 0.67, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to Welcome screen after 5.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 5500);

    return () => clearTimeout(timer);
  }, [navigation, bounceAnim, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: bounceAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Text style={styles.appName}>PECUNIA</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051A32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#D6B162',
    letterSpacing: 6,
  },
});

export default Intro;