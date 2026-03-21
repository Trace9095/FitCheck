import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0D1117' },
        headerTintColor: '#E6EDF3',
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: '#0D1117' },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In', headerShown: false }} />
    </Stack>
  )
}
