import { StyleSheet, Text, View } from 'react-native';

export default function AIScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 AI Consultant</Text>
      <Text style={styles.placeholder}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10
  },
  placeholder: {
    fontSize: 16,
    color: '#999'
  }
});
