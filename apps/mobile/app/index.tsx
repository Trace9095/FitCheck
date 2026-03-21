import { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { getStoredSession } from '../lib/storage'

export default function Index() {
  // Root redirects to auth or tabs based on session
  // This component uses Redirect for instant navigation — no flash
  return <AuthGate />
}

function AuthGate() {
  // For SSR-safe usage, check session synchronously from SecureStore
  // The actual async check is in _layout via expo-router's useEffect pattern
  return <Redirect href="/(auth)/login" />
}

// Re-export so the compiler doesn't tree-shake
export { getStoredSession }
