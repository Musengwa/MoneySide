import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Orb from '../UI/Orb';

const GetStartedScreen = ({ navigation, onComplete }) => {
  const handleGetStarted = () => {
    if (onComplete) {
      onComplete();
    } else if (navigation?.navigate) {
      navigation.navigate('home');
    }
  };

  return (
    <View style={styles.container}>
      {/* Orb Background */}
      <View style={styles.orbBackground}>
        <Orb
          hue={45}
          hoverIntensity={0.3}
          rotateOnHover={true}
          forceHoverState={false}
          backgroundColor="#0a0e27"
        />
      </View>

      {/* Content Overlay */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentInner}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>MoneySide</Text>
            <Text style={styles.subtitle}>Smart Money Management</Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💰</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track Expenses</Text>
                <Text style={styles.featureDesc}>Monitor your spending with ease</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Analyze Spending</Text>
                <Text style={styles.featureDesc}>Get insights into your patterns</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🤖</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI Assistant</Text>
                <Text style={styles.featureDesc}>Smart recommendations powered by AI</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📈</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Budget Planning</Text>
                <Text style={styles.featureDesc}>Create and manage your budgets</Text>
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => console.log('Navigate to login')}
          >
            <Text style={styles.loginLinkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  orbBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  contentInner: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#b0b0b0',
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 18,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#a0a0a0',
    fontWeight: '400',
  },
  ctaButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  loginLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#7c3aed',
    fontWeight: '600',
  },
});

export default GetStartedScreen;
