import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0D1117" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0D1117' },
          headerTintColor: '#E6EDF3',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0D1117' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
