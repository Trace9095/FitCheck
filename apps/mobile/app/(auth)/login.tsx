import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { apiPost } from '../../lib/api'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSendLink() {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      await apiPost('/api/auth/login', { email: email.trim().toLowerCase() })
      setSent(true)
    } catch {
      Alert.alert('Error', 'Failed to send magic link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a magic link to {email}. Tap the link to sign in.
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setSent(false)}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Use a different email</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>
          We&apos;ll send you a magic link — no password needed.
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor="#8B949E"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={handleSendLink}
          accessibilityLabel="Email address"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendLink}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Send magic link"
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#0D1117" />
          ) : (
            <Text style={styles.buttonText}>Send magic link</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E6EDF3',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B949E',
    lineHeight: 20,
  },
  input: {
    height: 48,
    backgroundColor: '#1C2333',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#30363D',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#E6EDF3',
  },
  button: {
    height: 48,
    backgroundColor: '#D4A853',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0D1117',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#D4A853',
    fontSize: 14,
    fontWeight: '600',
  },
})
